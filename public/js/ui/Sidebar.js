/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {

    const sidebar = document.querySelector('.sidebar-toggle');
    sidebar.onclick = ()=>{
        const body = document.querySelector('body');
        body.classList.toggle('sidebar-open');
    }

  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
      const btnLogin = document.querySelector(".menu-item_login");
      btnLogin.addEventListener('click', (event)=>{
          event.preventDefault();
           App.getModal( 'login' ).open();
      });

      const btnRegister = document.querySelector('.menu-item_register');
      btnRegister.addEventListener('click', (event)=>{
        event.preventDefault();
        App.getModal('register').open();
      });
  }
}