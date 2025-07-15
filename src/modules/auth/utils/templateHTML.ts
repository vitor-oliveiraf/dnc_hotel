const templateHTML = (name: string, token: string) => {
  return `
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:30px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);font-family:Arial,sans-serif;">
          <div style="text-align:center;margin-bottom:20px;">
            <h2 style="margin:0;">Redefinição de Senha</h2>
          </div>

          <p style="margin:0 0 15px 0;">Olá, ${name},</p>

          <p style="margin:0 0 15px 0;">
            Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para continuar o processo de redefinição:
          </p>

          <div style="background-color:#f1f1f1;border:1px dashed #888;padding:15px;font-size:20px;font-weight:bold;text-align:center;letter-spacing:2px;margin:20px 0;">
            ${token}
          </div>

          <p style="margin:0 0 15px 0;">
            Se você não solicitou essa redefinição, pode ignorar este e-mail com segurança.
          </p>

          <div style="margin-top:30px;font-size:12px;color:#777;text-align:center;">
            © 2025 dnc_hotels. Todos os direitos reservados.
          </div>
        </div>

          `;
};

export default templateHTML;
