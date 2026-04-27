export const books = [
  {
    id: 0,
    title: "The Great Gatsby",
    img: "/images/gatsby.jpg",
    author: "F. Scott Fitzgerald",
    description: "A story of wealth and excess in the Jazz Age.",
    year: 19-25,
  },
  {
    id: 1,
    title: "1984",
    img: "/images/1984.jpg",
    author: "George Orwell",
    description: "A dystopian social science fiction novel.",
    year: 1949,
  },
 
];

// Creates rows (5 rows of 10 books each)
export const rows = Array.from({ length: 5 }, (_, rowIndex) => ({
  id: rowIndex,
  title: `Row ${rowIndex + 1}`,
  books: books.slice(rowIndex * 10, (rowIndex + 1) * 10),
}));




