import { cleanup, fireEvent, render } from '@testing-library/react';
import Wordle from '../components/Wordle';

afterEach(cleanup);

describe('タイプした文字が正しく表示される', () => {
  let letter0: HTMLElement;
  let letter1: HTMLElement;
  let letter2: HTMLElement;
  let letter3: HTMLElement;
  let letter4: HTMLElement;
  let inputWord: HTMLElement;
  beforeEach(() => {
    const { getByTestId } = render(<Wordle />);
    letter0 = getByTestId('letter0');
    letter1 = getByTestId('letter1');
    letter2 = getByTestId('letter2');
    letter3 = getByTestId('letter3');
    letter4 = getByTestId('letter4');
    inputWord = getByTestId('input');
  });

  it('キーボードから a が入力されたら、"a"が表示される', () => {
    fireEvent.keyDown(document.body, { key: 'a' });
    expect(letter0.textContent).toBe('a');
  });

  it('キーボードから文字の削除ができる', () => {
    fireEvent.keyDown(document.body, { key: 'a' });
    fireEvent.keyDown(document.body, { key: 'Backspace' });
    expect(letter0.textContent).toBe('');
    fireEvent.keyDown(document.body, { key: 'abc' });
    fireEvent.keyDown(document.body, { key: 'Backspace' });
    expect(letter1.textContent).toBe('b');
    expect(letter2.textContent).toBe('');
  });

  it('入力された文字が5文字より大きい場合はそれ以上入力されない', () => {
    'abcdef'.split('').forEach((letter) => {
      fireEvent.keyDown(document.body, { key: letter });
    });
    expect(inputWord.textContent).toBe('abcde');
  });
  it.todo('仮想キーボードから a が入力されたら、"a"が表示される');
  it.todo(
    '入力が完了してエンターが押されたら、wordが空になり、表示される文字は空文字になる'
  );
});

describe('正解の文字列との比較', () => {
  it.todo('入力された文字と、正解の文字の位置が一致したら、緑色で表示される');
  it.todo(
    '入力された文字と、正解の文字の位置が一致はしないがどこかに存在する場合、黄色で表示される'
  );
});
