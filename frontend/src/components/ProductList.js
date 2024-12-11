import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductList.css';

function ProductList() {
  const { listId } = useParams();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const storedLists = JSON.parse(localStorage.getItem(storedUserId + '_shoppingLists')) || [];
      const currentList = storedLists.find(list => list.id === listId); // ищем список по ID
      if (currentList) {
        setProducts(currentList.items);  // загружаем товары
        setTotalPrice(currentList.price);  // загружаем общую цену
      }
    }
  }, [listId]);
  

  const handleBackToLists = () => {
    navigate('/shopping-lists');
  };

  const updateTotalPriceInLocalStorage = (updatedProducts, newTotalPrice) => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const storedLists = JSON.parse(localStorage.getItem(storedUserId + '_shoppingLists')) || [];
  
      // Обновляем все списки с одинаковым ID
      const updatedLists = storedLists.map(list => 
        list.id === listId ? { ...list, items: updatedProducts, price: newTotalPrice } : list
      );
  
      localStorage.setItem(storedUserId + '_shoppingLists', JSON.stringify(updatedLists));
    }
  };
  

  const addProduct = () => {
    if (!newProduct || !newPrice || isNaN(newPrice) || parseFloat(newPrice) <= 0) {
      alert('Пожалуйста, введите корректное название товара и цену.');
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: newProduct,
      price: parseFloat(newPrice),
      quantity: 1
    };

    const updatedProducts = [...products, product];
    const newTotalPrice = updatedProducts.reduce((total, p) => total + p.price * p.quantity, 0);
    setProducts(updatedProducts);
    setTotalPrice(newTotalPrice);

    updateTotalPriceInLocalStorage(updatedProducts, newTotalPrice);

    setNewProduct('');
    setNewPrice('');
  };

  const changeQuantity = (id, change) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? { ...product, quantity: Math.max(1, product.quantity + change) }
        : product
    );
    const newTotalPrice = updatedProducts.reduce((total, p) => total + p.price * p.quantity, 0);
    setProducts(updatedProducts);
    setTotalPrice(newTotalPrice);

    updateTotalPriceInLocalStorage(updatedProducts, newTotalPrice);
  };

  return (
    <div className="product-list">
      <div className="header">
        <img src="/directory.png" alt="Иконка папки" className="folder-icon" />
        <h1>Ваши продукты</h1>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Искать продукты" />
        <img src="/search.png" alt="Поиск" />
      </div>

      <div className="shopping-lists">
        {products.map(product => (
          <div key={product.id} className="shopping-list-item">
            <h2>{product.name}</h2>

            <div className="price-container">
              {product.price.toFixed(2)} руб.
            </div>

            <div className="quantity-controls">
              <button onClick={() => changeQuantity(product.id, -1)}>-</button>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => changeQuantity(product.id, parseInt(e.target.value) - product.quantity)}
                min="1"
              />
              <button onClick={() => changeQuantity(product.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="total-price">
        <strong>Итого: </strong>{totalPrice.toFixed(2)} руб.
      </div>

      <div className="add-product">
        <input
          type="text"
          placeholder="Название товара"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
        />
        <input
          type="number"
          placeholder="Цена за единицу"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          min="1"
          step="1"
        />
        <button onClick={addProduct}>Добавить товар</button>
        <button onClick={handleBackToLists} className="back-button">
          Назад к спискам
        </button>
      </div>
    </div>
  );
}

export default ProductList;