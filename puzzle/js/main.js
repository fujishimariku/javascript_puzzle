var gazou= prompt("パズルを選択してください。1:数字パズル、2:花火、３:ローマ数字、４:夕日         数値を入力 : ","1");
if(gazou == 1){
 gazou = 'img/15puzzle.png'
}else if(gazou == 2){
 gazou = 'img/hanabi.jpg'
}else if(gazou == 3){
 gazou = 'img/ro-masuuji.jpg'
}else if(gazou == 4){
 gazou = 'img/yuuhi.jpg'
}else{
 document.write("正しい数値を入力してください。")
}
var Difficulty = prompt("難易度を設定します。数値が大きいほど難易度は高くなります。整数を入力 : ","30");
(() => {
  
  class Puzzle {
    constructor(canvas, level) {                                              //canvasを受け取る　
      this.canvas = canvas;                                                   //puzzleクラスにプロパティとしてcanvasをセット
      this.level = level;
      this.ctx = this.canvas.getContext('2d');                                //canvasに描画するためのコンテキストを取得しctxに格納　引数を2dにすることで２Ｄグラフィックに
      this.TILE_SIZE = 70;                                                    //一つのタイルのサイズ
                                                        
      this.tiles = [                                                          //行ごとの配列の配列を作成
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];

      this.isCompleted = false;                     
      this.img = document.createElement('img');                               //画像をプロパティとして保持
      this.img.src = gazou;                                                   //画像を読み込む
      this.img.addEventListener('load', () => {                               //画像を読み終えたときに次の処理
        this.render();                                                        //renderメソッドを呼び出す
      });

      this.canvas.addEventListener('click', e => {　                          //クリックしたときの処理　クリックしたところの座標を取得
        if (this.isCompleted === true) {                                      //ゲームをクリアしたらクリックイベントを起こさない
          return;
        }

        const rect = this.canvas.getBoundingClientRect();                     //getBoundingClientRectで位置やサイズのオブジェクトを取得
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);     //クリックされた座標が何列目かを計算　左端を原点にしたいので上で取得したオブジェクトを引く
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);      //クリックされた座標が何行目かを計算
        this.swapTiles(col, row);                                             //タイルを入れ替えるメソッドに列と行をセット
        this.render();                                                        //タイルを入れ替えた後に再描画

        if (this.isComplete() === true) {　　　　　　　                       //すべてを並び終えたらrenderGameClearを呼ぶ
          this.isCompleted = true;                     
          this.renderGameClear();
        }

      });
      do {                                                                    //シャッフルしたときに最初から完成していたらやり直し
      this.shuffle(this.level);                                               //shuffleに渡す引数を設定
    } while (this.isComplete() === true);
  }
    
    shuffle(n) {
      let blankCol = 3;                                                       //空白の初期位置を右下に
      let blankRow = 3;

      for (let i = 0; i < n; i++) {                                           //n回文シャッフルするためのループ  
        let destCol;                                                          //空白を動かす先の列と行を変数で宣言
        let destRow;

        do {                                                                  //範囲外の時にやりなおす
          const dir = Math.floor(Math.random() * 4);                          //動かす先をランダムにするために０から３までのランダムな整数値を作成
          switch (dir) {                                                      //dirの値に応じで上下左右で列と行の計算
            case 0: // up
              destCol = blankCol;
              destRow = blankRow - 1;
              break;
            case 1: // down
              destCol = blankCol;
              destRow = blankRow + 1;
              break;
            case 2: // left
              destCol = blankCol - 1;
              destRow = blankRow;
              break;
            case 3: // right
              destCol = blankCol + 1;
              destRow = blankRow;
              break;
          }

        } while (                                                             //範囲外になる条件
          destCol < 0 || destCol > 3 ||
          destRow < 0 || destRow > 3
        );

        [                                                                     //分割代入を使って入れ替える
          this.tiles[blankRow][blankCol],
          this.tiles[destRow][destCol],
        ] = [
          this.tiles[destRow][destCol],
          this.tiles[blankRow][blankCol],
        ];
        [blankCol, blankRow] = [destCol, destRow];                            //空白のタイルが動いたら更新
      }
    }


    swapTiles(col, row) {
      if (this.tiles[row][col] === 15) {                                      //クリックしたタイルが１５だったら何もしない
        return;
      }

      for (let i = 0; i < 4; i++) {                                           //クリックしたタイルの上下左右が空白かどうかを調べるループ
        let destCol;                                                          //調べたいタイルの列
        let destRow;                                                          //調べたいタイルの行

        switch (i) {                                                          //switchで上下左右、４回分             
          case 0:                                                             //０だった場合は上を調べる
            destCol = col;                                                    //列はそのまま
            destRow = row - 1;                                                //一つ上の行なのでrowから１をひく
            break;                              
          case 1:                                                             //１だった場合は下を調べる
            destCol = col;
            destRow = row + 1;                                                //一つ下の行なのでrowに１を足す
            break;
          case 2:                                                             //２だった場合は左を調べる
            destCol = col - 1;                                                //１つ左の列なのでcol-1
            destRow = row;
            break;
          case 3:                                                             //３だった場合は右を調べる
            destCol = col + 1;                                                //１つ右の列なのでcol+1
            destRow = row;
            break;
        }
        if (                                                                  //this.tilesの範囲を超えるとエラーになるのでチェック
          destCol < 0 || destCol > 3 ||
          destRow < 0 || destRow > 3
        ) {
          continue;
        }

        if (this.tiles[destRow][destCol] === 15) {                            //中身が１５、空白だったら入れ替える
          [
            this.tiles[row][col],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[row][col],
          ];
          break;
        }
      }
    }

    isComplete() {                                                            //ゲームクリアの判定
      let i = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.tiles[row][col] !== i++) {      
            return false;
          }
        }
      }
      return true;
    }

    renderGameClear() {                                                       //ゲームクリアしたときに呼び出される処理
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';                              //半透明の黒色の四角
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);         //を上にかぶせる
      this.ctx.font = '28px Arial';                                           //フォントの設定
      this.ctx.fillStyle = '#fff';                                            //文字を白色に
      this.ctx.fillText('GAME CLEAR!!', 40, 150);                             //表示される文字と位置
    }

    render() {                                                                //描画するメソッドを作成、すべての値を描画したいので２重ループを作成
      for (let row = 0; row < 4; row++) {                                     //行数分のループ
        for (let col = 0; col < 4; col++) {                                   //列数分のループ
          this.renderTile(this.tiles[row][col], col, row);                    //row,colのあたいのタイルを切り出してcol列目、row列目に描画
        }
      }
    }

    renderTile(n, col, row) {                                                 //メソッドの定義、引数を設定
      if (n === 15) {                                                         //空白の時に見やすくグレーに表示させる
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(col * this.TILE_SIZE, row * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
      } else {
        this.ctx.drawImage(                                                   //画像の一部を切り出す
          this.img,
          (n % 4) * this.TILE_SIZE, Math.floor(n / 4) * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE,      //タイルのサイズである幅７０高さ７０の領域を切り出す
      　　                                                                    //sxの座標は０、１、２、３と繰り返され、syはnが１増えるごとに４づつ増えるので上記の記述に
          col * this.TILE_SIZE, row * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE                         //canvasのdx,dy座標の同じ大きさの領域に描画
                                                                              //dxはcolが１増えるごとに７０増えdyはrowが１増えるごとに７０増える。
        );
      }
    }
  }
  
  const canvas = document.querySelector('canvas');                             //canvas要素を取得
  if (typeof canvas.getContext === 'undefined') {                              //canvasが取得できなかった時
    return;                                                                    //returnを使用するために全体に即時関数を適用
  }

  new Puzzle(canvas, Difficulty);                                             //インスタンスを作成して引数にcanvasをセット、シャッフル回数をセット
 
})();
