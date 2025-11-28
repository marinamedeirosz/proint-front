export const validateCEP = async (cep: string): Promise<boolean> => {
  const cleanedCEP = cep.split('-').join('');
  if (cleanedCEP.length < 8) {
    return false;
  }
  const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`);
  const data = await response.json();
  return !data.erro;
};