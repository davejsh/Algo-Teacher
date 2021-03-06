import Randompeople from '../data/Randompeople';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import Error from '../utils/Error'; // 에러 핸들링
import Alert from '../utils/Alert'; // Materialize 알림창

var Hashtable = {
  create: $('#hashtable_create'),
  remove: $('#hashtable_remove'),
  inputname: $('#hashtable_input_name'),
  inputemail: $('#hashtable_input_email'),
  hashtablediv: $('#hashtable_table'),
  hashtabletable: $('#hashtable_table table'),
  table: [],

  init: function() {
    this.put('류한경', '류한경@gmail.com');
    this.put('김나마', '김나마@gmail.com');
    this.put('박한별', '박한별@gmail.com');
    this.put('김혜지', '김혜지@gmail.com');
    this.rendering('basic'); // 초기 기본 랜더링
    this.randomInput(); // 인풋 랜덤 값 삽입
    this.event();
  },

  event: function() {
    this.create.click(() => {
      var name = this.inputname.val();
      var email = this.inputemail.val();
      try {
        if(name == '' || email == '') throw new Error('NEED INPUT', '요소는 필수 입력이예요!');
        // 갯수가 0이 아니면 이미 데이터가 존재한다
        if(this.findPosition(this.loseloseHashCode(name)) != 0) {
          throw new Error('CRASH', '충돌이 발생했어요!');
        } else {
          Alert('정상적으로 추가되었어요!', 3000);
          // 데이터 상자에 데이터 삽입
          this.put(name, email);
          setTimeout(() => { this.randomInput(); }, 3000);
          this.rendering('mark', this.findPosition(this.loseloseHashCode(name))[0].key);
          return;
        }
      } catch(e) {
        if(e.name == 'NEED INPUT') {
          Alert(e.message, 3000);
          this.inputname.focus();
          return;
        } else if(e.name == 'CRASH') {
          Alert(e.message, 4000);
          this.rendering('crash', this.findPosition(this.loseloseHashCode(name))[0].key);

          // 충돌된 인풋 박스 스타일링
          this.inputname.css({ 'color': '#f03e3e', 'font-weight': 'bold' });
          this.inputemail.css({ 'color': '#f03e3e', 'font-weight': 'bold' });
          setTimeout(() => {
            // 4초 지난후 스타일링 복구
            this.randomInput();
            this.inputname.css({ 'background-color': 'white', 'color': 'black', 'font-weight': 'none' });
            this.inputemail.css({ 'background-color': 'white', 'color': 'black', 'font-weight': 'none' });
          }, 4000)
          return;
        }
      }
    })

    this.remove.click(() =>{
      swal({
        title: "삭제",
        text: "이름에 해당하는 해시 값을 삭제해요!",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "이름을 입력하세요"
      }, (inputValue) => {
        if(inputValue === false) return false;
        if(inputValue === "") {
          swal.showInputError("이름은 필수입력입니다!");
          return false;
        }

        if(this.findkey(inputValue).length == 0) {
          swal.showInputError("존재하지 않아 삭제 할 수 없습니다.");
          return false;
        } else {
          swal({
            type: "success",
            title: "정상 삭제되었어요!",
            timer: 2000,
            showConfirmButton: false
          });
          this.rendering('crash', this.findPosition(this.loseloseHashCode(inputValue))[0].key);
          setTimeout(() => {
            this.delete(inputValue);
            this.rendering('basic');
          }, 2000)
          return;
        }

      })
    })
  },

  /* utils */

  randomInput: function() {
    var value = Randompeople();
    this.inputname.val(value.name);
    this.inputemail.val(value.email);
  },

  loseloseHashCode: function(key) {
    var hash = 0;
    for(var i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % 37;
  },

  // rendering

  rendering: function(type, key) {
    this.hashtabletable.html('');
    this.hashtabletable.html('<tr><th>이름/키</th><th>해시 값</th><th>값</th></tr>');

    switch(type) {
      case 'basic': // 기본 랜더링
        filter(this.table, (item) => {
          return item !== undefined;
        }).forEach((item) => {
            this.hashtabletable.append('<tr><td>'+item.key+'</td><td>'+item.position+'</td><td>'+item.value+'</td></tr>');
        });
        break;
      case 'crash': // 충돌 발생시 데이터 삽입시 이름이 다르더라도 해시값이 같은 경우 충돌 발생했다고 한다.
        filter(this.table, (item) => {
          return item !== undefined;
        }).forEach((item) => {
          if(item.key == key) {
            this.hashtabletable.append('<tr style="background-color:#f03e3e; color: #fff; font-weight: bold;"><td>'+item.key+'</td><td>'+item.position+'</td><td>'+item.value+'</td></tr>');
          } else {
            this.hashtabletable.append('<tr><td>'+item.key+'</td><td>'+item.position+'</td><td>'+item.value+'</td></tr>');
          }
        });
        break;
      case 'mark':
        filter(this.table, (item) => {
          return item !== undefined;
        }).forEach((item) => {
          if(item.key == key) {
            this.hashtabletable.append('<tr style="background-color:#4B9BE1; color: #fff; font-weight: bold;"><td>'+item.key+'</td><td>'+item.position+'</td><td>'+item.value+'</td></tr>');
          } else {
            this.hashtabletable.append('<tr><td>'+item.key+'</td><td>'+item.position+'</td><td>'+item.value+'</td></tr>');
          }
        });
        break;
    }
  },

  // hashtable function

  put: function(key, value) {
    var position = this.loseloseHashCode(key);
    this.table[position] = {
      position: position,
      key: key,
      value: value
    };
  },
  findkey: function(key) {
    var find = filter(this.table, (item) => {
      return item !== undefined;
    }).filter((item) => {
      return item.key == key;
    })

    return find;
  },
  delete: function(key) {
    delete this.table[this.loseloseHashCode(key)];
  },
  // search function

  /* 이미 데이터 안에 존재하는 유저가 있는지 확인하는 함수 */
  findPosition: function(position) {
    var alreay = filter(this.table, (item) => {
      return item !== undefined;
    }).filter((item) => {
      return item.position == position;
    });

    return alreay;
  }
}

export default Hashtable;
