const numbersMap: { [key: string]: string } = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

export function mapArabicNumbers(number: string): string {
  return number
    .split('')
    .map((char) => {
      return numbersMap[char] || char;
    })
    .join('');
}
