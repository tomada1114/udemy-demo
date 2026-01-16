const { add, findMax, reverseString } = require('../src/example');

describe('add', () => {
  // 正常系
  describe('正常系', () => {
    test('2つの正の数を加算できる', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('負の数を含む加算ができる', () => {
      expect(add(-2, 3)).toBe(1);
      expect(add(2, -3)).toBe(-1);
      expect(add(-2, -3)).toBe(-5);
    });

    test('0を含む加算ができる', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });
  });

  // 境界値
  describe('境界値', () => {
    test('非常に大きな数値を加算できる', () => {
      expect(add(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('非常に小さな数値を加算できる', () => {
      expect(add(Number.MIN_SAFE_INTEGER, 0)).toBe(Number.MIN_SAFE_INTEGER);
    });

    test('小数点を含む数値を加算できる', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });
});

describe('findMax', () => {
  // 正常系
  describe('正常系', () => {
    test('配列から最大値を取得できる', () => {
      expect(findMax([1, 5, 3, 9, 2])).toBe(9);
    });

    test('負の数を含む配列から最大値を取得できる', () => {
      expect(findMax([-5, -1, -10])).toBe(-1);
    });

    test('正負混合の配列から最大値を取得できる', () => {
      expect(findMax([-3, 0, 5, -1, 2])).toBe(5);
    });

    test('同じ値が複数ある場合も最大値を取得できる', () => {
      expect(findMax([5, 5, 5])).toBe(5);
    });
  });

  // 境界値
  describe('境界値', () => {
    test('要素が1つの配列から最大値を取得できる', () => {
      expect(findMax([42])).toBe(42);
    });

    test('要素が2つの配列から最大値を取得できる', () => {
      expect(findMax([1, 2])).toBe(2);
      expect(findMax([2, 1])).toBe(2);
    });

    test('非常に大きな数値を含む配列から最大値を取得できる', () => {
      expect(findMax([1, Number.MAX_SAFE_INTEGER, 100])).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('非常に小さな数値を含む配列から最大値を取得できる', () => {
      expect(findMax([Number.MIN_SAFE_INTEGER, -100, -1])).toBe(-1);
    });
  });

  // エラー処理
  describe('エラー処理', () => {
    test('空配列の場合はエラーをスローする', () => {
      expect(() => findMax([])).toThrow('配列が空です');
    });
  });
});

describe('reverseString', () => {
  // 正常系
  describe('正常系', () => {
    test('文字列を反転できる', () => {
      expect(reverseString('hello')).toBe('olleh');
    });

    test('日本語文字列を反転できる', () => {
      expect(reverseString('あいう')).toBe('ういあ');
    });

    test('数字を含む文字列を反転できる', () => {
      expect(reverseString('abc123')).toBe('321cba');
    });

    test('スペースを含む文字列を反転できる', () => {
      expect(reverseString('hello world')).toBe('dlrow olleh');
    });
  });

  // 境界値
  describe('境界値', () => {
    test('空文字列を反転すると空文字列を返す', () => {
      expect(reverseString('')).toBe('');
    });

    test('1文字の文字列を反転するとそのまま返す', () => {
      expect(reverseString('a')).toBe('a');
    });

    test('2文字の文字列を反転できる', () => {
      expect(reverseString('ab')).toBe('ba');
    });

    test('回文を反転すると同じ文字列を返す', () => {
      expect(reverseString('madam')).toBe('madam');
    });
  });

  // 特殊文字
  describe('特殊文字', () => {
    test('記号を含む文字列を反転できる', () => {
      expect(reverseString('!@#$%')).toBe('%$#@!');
    });

    test('改行を含む文字列を反転できる', () => {
      expect(reverseString('a\nb')).toBe('b\na');
    });
  });
});
