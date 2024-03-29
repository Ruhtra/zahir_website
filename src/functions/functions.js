function removeEmptyValues(obj) {
    if (Array.isArray(obj)) { return obj.map((item) => removeEmptyValues(item)) } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
        Object.entries(obj)
        .filter(([_, value]) => value !== '' && value !== undefined)
        .map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null ? removeEmptyValues(value) : value,
        ])
    );
    }
    return obj

}
function shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

module.exports = {
    removeEmptyValues,
    shuffle
}