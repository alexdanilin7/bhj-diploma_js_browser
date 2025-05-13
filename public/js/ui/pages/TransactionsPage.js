/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  

  constructor( element ) {
      if(!element){
        console.error(new Error('Элемент не существует'));
      }else{
        this.element = element;
        this.registerEvents();
      }
      this.lastOptions = null;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions){
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {

      const btnDeleteAccount = this.element.querySelector('.remove-account');
      const btnDeleteTrasaction = this.element.querySelectorAll('.transaction__remove');
      btnDeleteAccount.addEventListener('click', ()=>{
          this.removeAccount();
      });
      if(btnDeleteTrasaction){
        btnDeleteTrasaction.forEach(btn=>{
          btn.addEventListener('click', ()=>{
            console.log('asd');
            this.removeTransaction(btn.dataset.id);
          })
        })
      }
     
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions){
      const isConfirmed = confirm(`Вы действительно хотите удалить счёт?`);
      if(isConfirmed){
        Account.remove({'id': this.lastOptions.account_id}, (err, response)=>{
          if(err){
            throw new Error('Ошибка удаления счета'+err);
          }
          if (response && response.success){
              App.updateWidgets();
              App.updateForms();
              App.update();
              App.clear();
          }
        });
      }
      this.clear();
    }
    

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
      const isConfirmed = confirm(`Вы действительно хотите удалить эту транзакцию?`);
      if (isConfirmed){
        console.log('asdss');
        Transaction.remove({id,}, (err, response)=>{
          if (err){
           throw new Error('Ошибка');
          }
          if (response && response.success){
             App.update();
          }
       });
      }
      
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(!options){
      throw new Error("Нет элемента");
    }
    this.lastOptions = options;
      Account.get(options.account_id, (err, response)=>{
        if(err){
          console.error(new Error("Ошибка: "+err));
          return;
        }

        if (response && response.success){
          this.renderTitle(response.data.name);   
        }
      });

      Transaction.list(options, (err, response)=>{
          if(response && response.success){
            this.clear();
            this.renderTransactions(response.data);
          }
      });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
   // this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = this.element.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
        const dateNew = new Date(date);
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        
        const day = dateNew.getDate(); 
        const month = months[dateNew.getMonth()]; 
        const year = dateNew.getFullYear(); 
        const hours = String(dateNew.getHours()).padStart(2, '0'); 
        const minutes = String(dateNew.getMinutes()).padStart(2, '0'); 
        return `${day} ${month} ${year} г. в ${hours}:${minutes}`;  
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const classItemHTML = (item.type.toLowerCase() === 'income') ? 'transaction_income': 'transaction_expense';
    const content = this.element.querySelector('.content');
    content.insertAdjacentHTML("beforeend", 
      `<div class="transaction ${classItemHTML} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`);
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    if(data.length === 0){
      const content = this.element.querySelector('.content');
      content.textContent = "";
      return;
    }
      data.forEach(item => {
        this.getTransactionHTML(item);
      });
      this.registerEvents();
  }
}