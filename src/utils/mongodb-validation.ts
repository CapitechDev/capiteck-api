/**
 * Valida se uma string é um ObjectID válido do MongoDB
 * @param id - String a ser validada
 * @returns boolean - true se é um ObjectID válido, false caso contrário
 */
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}