const createKeyWords = (name) => {
  const arrName = [];
  let curName = '';
  name.split('').forEach(letter => {
    curName += letter;
    arrName.push(curName.toLowerCase());
  });
  return arrName;
}

export const generateKeywords = ( title = '', ingredients = []) => {
  const keywordTitle = createKeyWords(title);
  const keywords = [ ...keywordTitle ];
 
  const keywordIngredients = ingredients.map(ing => createKeyWords(ing)).flat();
  
  keywordIngredients.forEach(word => {
    if (!keywords.includes(word)) {
      keywords.push(word)
    }
  });

  return keywords;
}