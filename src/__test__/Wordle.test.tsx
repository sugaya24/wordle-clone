import { cleanup, fireEvent, render } from '@testing-library/react';
import Wordle from '../components/Wordle';

afterEach(cleanup);

describe('タイプした文字が正しく表示される', () => {
  let inputWord: HTMLElement;
  let rowCount: HTMLElement;
  beforeEach(() => {
    const { getByTestId } = render(<Wordle />);
    inputWord = getByTestId('input');
    rowCount = getByTestId('word-count');
  });

  it('キーボードから a が入力されたら、"a"が表示される', () => {
    fireEvent.keyDown(document.body, { key: 'a' });
    if (inputWord.textContent) {
      expect(inputWord.textContent!.split('')[0]).toBe('a');
    }
  });

  it('キーボードから文字の削除ができる', () => {
    fireEvent.keyDown(document.body, { key: 'a' });
    fireEvent.keyDown(document.body, { key: 'Backspace' });
    expect(inputWord.textContent).toBe('');
  });

  it('入力された文字が5文字より大きい場合はそれ以上入力されない', () => {
    'abcdef'.split('').forEach((letter) => {
      fireEvent.keyDown(document.body, { key: letter });
    });
    if (inputWord.textContent) {
      expect(inputWord.textContent).toBe('abcde');
    }
  });
  it.todo('仮想キーボードから a が入力されたら、"a"が表示される');
  describe('入力が完了して、エンターが押される', () => {
    it('wordが5文字なら、wordが空になる', () => {
      'abcde'.split('').forEach((letter) => {
        fireEvent.keyDown(document.body, { key: letter });
      });
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(inputWord.textContent).toBe('');
    });
    it('wordが5文字より少なければ、何もしない', () => {
      'abc'.split('').forEach((letter) => {
        fireEvent.keyDown(document.body, { key: letter });
      });
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(inputWord.textContent).toBe('abc');
    });
  });
  it('一回めの単語のチェックが終わったら、次の列へ移動', () => {
    expect(rowCount.textContent).toBe('0');
    'abcde'.split('').forEach((letter) => {
      fireEvent.keyDown(document.body, { key: letter });
    });
    fireEvent.keyDown(document.body, { key: 'Enter' });
    expect(rowCount.textContent).toBe('1');
  });
});

describe('正解の文字列との比較', () => {
  it.todo('入力された文字と、正解の文字の位置が一致したら、緑色で表示される');
  it.todo(
    '入力された文字と、正解の文字の位置が一致はしないがどこかに存在する場合、黄色で表示される'
  );
});
