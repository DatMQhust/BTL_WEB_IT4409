const generateTransferContent = orderId => {
  return `DH${orderId}`;
};

const parseWebhookPayload = payload => {
  return {
    sepayTransactionId: payload.id?.toString(),
    gateway: payload.gateway,
    transactionDate: payload.transactionDate,
    accountNumber: payload.accountNumber,
    transferAmount: payload.transferAmount,
    transferType: payload.transferType, // 'in' or 'out'
    bankTransferCode: payload.code,
    transferContent: payload.content,
    referenceCode: payload.referenceCode,
    description: payload.description,
    accumulated: payload.accumulated,
    rawData: payload,
  };
};

const extractOrderIdFromContent = transferContent => {
  if (!transferContent) return null;

  const content = transferContent.replace(/\s/g, '').toUpperCase();

  const match = content.match(/DH([A-Z0-9]+)/);

  return match ? match[1] : null;
};

const generatePaymentInfo = (orderId, amount) => {
  const bankCode = process.env.SEPAY_BANK_CODE || 'MBBank';
  const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER;
  const accountName = process.env.SEPAY_ACCOUNT_NAME;
  const transferContent = generateTransferContent(orderId);

  const qrCodeUrl = generateVietQRUrl(
    bankCode,
    accountNumber,
    amount,
    transferContent,
    accountName
  );

  return {
    bankCode,
    bankName: getBankName(bankCode),
    accountNumber,
    accountName,
    amount,
    transferContent,
    qrCodeUrl,
    expiresIn: 15 * 60, // 15 phút (giây)
  };
};

const generateVietQRUrl = (
  bankCode,
  accountNumber,
  amount,
  content,
  accountName
) => {
  const template = 'compact';
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`;
};

const getBankName = bankCode => {
  const bankNames = {
    VCB: 'Vietcombank',
    TCB: 'Techcombank',
    MB: 'MBBank',
    VIB: 'VIB',
    ACB: 'ACB',
    BIDV: 'BIDV',
    VPB: 'VPBank',
    TPB: 'TPBank',
    STB: 'Sacombank',
    MSB: 'MSB',
    OCB: 'OCB',
  };

  return bankNames[bankCode] || bankCode;
};

const validateWebhookPayload = payload => {
  const errors = [];

  if (!payload.id) errors.push('Missing transaction id');
  if (!payload.content) errors.push('Missing content');
  if (!payload.transferAmount) errors.push('Missing transferAmount');
  if (!payload.code) errors.push('Missing code');

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  generateTransferContent,
  parseWebhookPayload,
  extractOrderIdFromContent,
  generatePaymentInfo,
  generateVietQRUrl,
  getBankName,
  validateWebhookPayload,
};
