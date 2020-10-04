import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = (props) => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  useEffect(() => {
    fetch(`https://udemy-react-hook-task6.firebaseio.com/ingredients.json`)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        const loadedIngredients = [];
        for(let key in responseData){
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        };
        setUserIngredients(loadedIngredients);
      })
      .catch(error => {
        alert(error);
      });
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch(`https://udemy-react-hook-task6.firebaseio.com/ingredients.json`, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name,...ingredient}
      ]);
    }).catch(error => {
      alert(error);
    })

  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients(prevIngredients => {
      return prevIngredients.filter((item) => item.id !== ingredientId);
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
