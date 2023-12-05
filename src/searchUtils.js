export function searchArray(array, searchTerm, filterFunction) {
    // Return the full array if the search term is empty
    if (searchTerm.trim() === '') {
      return array;
    }
  
    return array.filter(filterFunction);
  }