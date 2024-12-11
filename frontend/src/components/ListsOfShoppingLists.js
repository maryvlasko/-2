import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListsOfShoppingLists.css';

function ListsOfShoppingLists() {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [listId, setListId] = useState('');
  const [password, setPassword] = useState('');
  const [listName, setListName] = useState('');
  const [shoppingLists, setShoppingLists] = useState([]);
  const [userId, setUserId] = useState('');
  const [isNewList, setIsNewList] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setShoppingLists(JSON.parse(localStorage.getItem(storedUserId + '_shoppingLists')) || []);
    } else {
      const newUserId = Date.now().toString();
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const handleBackToOnboarding = () => {
    navigate('/');
  };

  const generateUniqueId = () => {
    let newId;
    do {
      newId = Date.now().toString();
    } while (shoppingLists.some(list => list.id === newId));
    return newId;
  };

  const handleAddList = () => {
    if (isNewList) {
      const generatedId = generateUniqueId();
      const newList = {
        id: generatedId,
        name: listName || `Список ${generatedId}`, // Если название не введено, назначить автоматически
        password: password,
        items: [],
        status: 'Запланированные',
        price: 0,
      };
      const updatedLists = [...shoppingLists, newList];
      setShoppingLists(updatedLists);
      localStorage.setItem(userId + '_shoppingLists', JSON.stringify(updatedLists));
    } else {
      if (listId.trim() === '' || password.trim() === '') {
        alert('Пожалуйста, введите ID и пароль списка.');
        return;
      }
  
      // Находим существующий список по ID и паролю
      const existingList = shoppingLists.find(list => list.id.trim() === listId.trim() && list.password.trim() === password.trim());
  
      if (existingList) {
        // Создаем "дубликат", который ссылается на тот же объект
        const duplicateList = { ...existingList };
  
        // Обновляем списки, добавляя дубликат
        const updatedLists = [...shoppingLists, duplicateList];
        setShoppingLists(updatedLists);
        localStorage.setItem(userId + '_shoppingLists', JSON.stringify(updatedLists));
  
        alert('Дубликат списка добавлен успешно!');
      } else {
        alert('Список с таким ID или паролем не найден.');
      }
    }
  
    // Закрытие модального окна и сброс полей ввода
    setShowAddListModal(false);
    setListId('');
    setPassword('');
    setListName('');
    setIsNewList(true);
  };
  
  

  const handleDeleteList = (id) => {
    const updatedLists = shoppingLists.filter(list => list.id !== id);
    setShoppingLists(updatedLists);
    localStorage.setItem(userId + '_shoppingLists', JSON.stringify(updatedLists));
  };

  const handleNavigation = (listId) => {
    navigate(`/product-list/${listId}`);
  };

  return (
    <div className="lists-of-shopping-lists">
      <div className="header">
        <img src="/directory.png" alt="Иконка папки" className="folder-icon" />
        <h1>Ваши списки</h1>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Поиск..." />
        <img src="/search.png" alt="Поиск" />
      </div>

      <div className="shopping-lists">
        {shoppingLists.map((list) => (
          <div key={list.id} className="shopping-list-item">
            <h2>{list.name} ({list.id})</h2> {/* Добавляем ID в скобках рядом с названием */}
            <button onClick={() => handleDeleteList(list.id)}>Удалить</button>
            <div className="price-container">
              {list.price ? list.price.toFixed(2) : 'Цена не указана'} руб.
            </div>
            <img
              src="/send.png"
              alt="Перейти"
              onClick={() => handleNavigation(list.id)}
            />
          </div>
        ))}
      </div>


      <button className="add-list-button" onClick={() => setShowAddListModal(true)}>
        Добавить список
      </button>

      {showAddListModal && (
        <div className="modal">
          <h2>Выберите действие</h2>
          <button onClick={() => { setIsNewList(true); setListId(''); setPassword(''); setListName(''); }}>Создать новый список</button>
          <button onClick={() => { setIsNewList(false); setListId(''); setPassword(''); }}>Ввести код списка</button>

          {isNewList ? (
            <div>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Название (необязательно)"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль (необязательно)"
              />
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                placeholder="ID списка"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
              />
            </div>
          )}

          <button onClick={handleAddList}>Сохранить</button>
          <button onClick={() => setShowAddListModal(false)}>Отмена</button>
        </div>
      )}

      <button className="back-to-onboarding" onClick={handleBackToOnboarding}>
        На главную
      </button>
    </div>
  );
}

export default ListsOfShoppingLists;
