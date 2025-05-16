/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const dataUser = User.current();
    if(dataUser){
      Account.list(dataUser, (err, response)=>{
            if (err) {
              console.log('Ошибка получения счетов:'+err);
              return;
          }
          if(response && response.success){
            const select = this.element.querySelector('select');
            select.options.length = 0;
            select.innerHTML = response.data.map(item => `<option value="${item.id}">${item.name}</option>`).join('');;
          }
      });
    }
    
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
      Transaction.create(data, (err, response)=>{
        if(err){
          console.log('Ошибка получения счетов:'+ err);
          return;
        }
        if (response && response.success){
          this.element.reset();
          const modal = this.element.closest('.modal');
          if(modal){
            App.getModal(modal.dataset.modalId).close();
          }
          App.update();
        }
      });
  }
}