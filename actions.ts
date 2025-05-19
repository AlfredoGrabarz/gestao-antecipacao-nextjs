
'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
// Alias the import from lib/auth to avoid conflict with the new server action
import {
  generatePasswordResetToken as generateTokenFromLib,
  verifyPasswordResetToken as verifyTokenFromLib, // Aliased
  hashPassword
} from '@/lib/auth';



interface RequestResetFormData {
  email: string;
}

interface ResetPasswordFormData {
  token: string;
  novaSenha: string;
}

export async function requestPasswordReset(formData: RequestResetFormData) {
  const { env } = getRequestContext();
  const db = (env as any).DB as any; // Modificado de D1Database para any
  const email = formData.email;

  try {
    const userStmt = db.prepare('SELECT id, email FROM usuarios WHERE email = ?');
    const user = await userStmt.bind(email).first() as { id: number; email: string } | undefined;

    if (!user) {
      // Return success true for security reasons, to not reveal if an email exists or not
      return { success: true, message: 'Se um usuário com este email existir, um link para redefinição de senha foi enviado.' };
    }

    // Use aliased generateTokenFromLib, ensuring user.id is a number
    const token = await generateTokenFromLib(user.id, user.email, db);

    console.log(`Password reset token for ${user.email} (user_id: ${user.id}): ${token}`);
    console.log(`Reset link (simulated): /reset-password/${token}`);

    return { success: true, message: 'Se um usuário com este email existir, um link para redefinição de senha foi enviado.' };
  } catch (error: any) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    return { success: false, message: 'Ocorreu um erro ao processar sua solicitação.' };
  }
}

export async function resetPassword(formData: ResetPasswordFormData) {
  const { env } = getRequestContext();
  const db = (env as any).DB as any; // Modificado de D1Database para any
  const { token, novaSenha } = formData;

  try {
    // Use aliased verifyTokenFromLib
    const userId = await verifyTokenFromLib(token, db);
    if (!userId) {
      return { success: false, message: 'Token inválido ou expirado.' };
    }

    const hashedPassword = await hashPassword(novaSenha);
    const updateUserStmt = db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?');
    await updateUserStmt.bind(hashedPassword, userId).run();

    const deleteTokenStmt = db.prepare('DELETE FROM password_reset_tokens WHERE token = ?');
    await deleteTokenStmt.bind(token).run();

    return { success: true, message: 'Senha redefinida com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error);
    return { success: false, message: 'Ocorreu um erro ao redefinir sua senha.' };
  }
}

// New server action for the form to verify the token, this will be imported by ResetPasswordForm.tsx
export async function verifyPasswordResetToken(token: string): Promise<{ valid: boolean; email?: string; message?: string }> {
  const { env } = getRequestContext();
  const db = (env as any).DB as any; // Modificado de D1Database para any

  try {
    // Call the aliased library function which returns userId (number) or null
    const userIdFromLib = await verifyTokenFromLib(token, db);

    if (userIdFromLib) {
        const userEmailStmt = db.prepare('SELECT email FROM usuarios WHERE id = ?');
        const user = await userEmailStmt.bind(userIdFromLib).first() as { email: string } | undefined;
        return { valid: true, email: user?.email, message: 'Token válido.' };
    } else {
        // Replicate logic for specific messages if token is invalid, as the lib function is minimal
        const tokenDetailsStmt = db.prepare('SELECT data_expiracao, utilizado FROM password_reset_tokens WHERE token = ?');
        const tokenDetails = await tokenDetailsStmt.bind(token).first() as { data_expiracao: string; utilizado: number } | undefined;

        if (tokenDetails) {
            if (tokenDetails.utilizado) return { valid: false, message: "Este token já foi utilizado." };
            const expirationDate = new Date(tokenDetails.data_expiracao);
            if (expirationDate < new Date()) return { valid: false, message: "Token expirado." };
        }
        return { valid: false, message: "Token inválido ou não encontrado." };
    }
  } catch (e: any) {
    console.error("Erro na action verifyPasswordResetToken:", e);
    return { valid: false, message: "Erro ao verificar o token." };
  }
}

