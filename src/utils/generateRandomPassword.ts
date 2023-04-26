export function generateRandomPassword(length: number): string {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const symbolChars = '!@#$%&';

  let validChars = '';
  let password = '';

  // 至少包含一个数字
  // 至少包含一个小写字母
  validChars += lowercaseChars;
  validChars += numericChars;
  password +=
    Math.random() > 0.5
      ? getRandomChar(numericChars)
      : getRandomChar(lowercaseChars);

  // 至少包含一个大写字母
  validChars += uppercaseChars;
  password += getRandomChar(uppercaseChars);

  // 至少包含一个数字或符号
  validChars += numericChars;
  password += getRandomChar(numericChars);

  validChars += symbolChars;
  password += getRandomChar(symbolChars);

  // 剩余字符随机生成
  validChars += numericChars + lowercaseChars + uppercaseChars + symbolChars;
  for (let i = 0; i < length - 3; i++) {
    password += getRandomChar(validChars);
  }

  // 将生成的密码随机排序
  return shuffleString(password);
}

function getRandomChar(characters: string): string {
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

function shuffleString(str: string): string {
  let array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}
