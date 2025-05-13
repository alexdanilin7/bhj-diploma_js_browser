/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
        if (!element) {
          throw new Error('Элемент не существует');
         }
      this.element = element;
      this.registerEvents();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
      const createAccount = this.element.querySelector('.create-account');
      createAccount.addEventListener('click', ()=>{
        const accountNewModal = App.getModal('createAccount');
        if(accountNewModal){
          accountNewModal.open();
        }
        
      });
      
      const accountes =  this.element.querySelectorAll('.account');
      accountes.forEach((item)=>{
          item.addEventListener('click', (event)=>{
            event.preventDefault();
            this.onSelectAccount(item);
          });
      });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const dataUser = User.current();
    if (dataUser && dataUser.name) {
        Account.list(dataUser, (err, response) => {
            if (err) {
                console.error('Ошибка получения счетов: '+err);
                return;
            }
            if (response.success) {
                const modal = App.getModal('createAccount');
                if (modal) {
                    modal.close();
                }
                this.clear();
                this.renderItem(response.data);
            }
        });
    } else {
        console.error('Пользователь не авторизован');
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
      const accounts =  this.element.querySelectorAll('.account');
      accounts.forEach(account =>{
        account.remove();
      });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach(account => {
        account.classList.remove('active');
    });
    element.classList.add('active');
    const accountId = element.dataset.id;
    if (accountId) {
        App.showPage('transactions', { account_id: accountId });
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    if (!item || !item.id || !item.name || item.sum===null) {
      console.error('Некорректные данные для счета:', item);
      return;
    }

    this.element.insertAdjacentHTML("beforeend", 
    `<li class="account" data-id="${item.id}">
      <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} ₽</span>
      </a>
    </li>`);
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Нет данных для отображения');
      return;
    }

    data.forEach((item)=>{
      this.getAccountHTML(item);
    });

    this.registerEvents();
  }
}
