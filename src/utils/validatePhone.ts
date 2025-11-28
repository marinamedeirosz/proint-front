export const validatePhone = (phone: string): boolean => {
  const cleanedPhone = phone.replace(/[^0-9]/g, '');

  // Aceita telefone com 10 ou 11 dígitos (com ou sem 9º dígito)
  if (cleanedPhone.length !== 10 && cleanedPhone.length !== 11) {
    return false;
  }

  // Verificar se começa com código de área válido (11-99)
  const areaCode = parseInt(cleanedPhone.substring(0, 2));
  if (areaCode < 11 || areaCode > 99) {
    return false;
  }

  // Se tem 11 dígitos, o terceiro dígito deve ser 9
  if (cleanedPhone.length === 11 && cleanedPhone[2] !== '9') {
    return false;
  }

  return true;
};