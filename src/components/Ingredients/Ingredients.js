import React, { useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ingredient => ingredient.id !== action.id);
    default: 
      throw new Error('Should not get there!');
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type){
    case 'STARTSEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return { ...currentHttpState, loading: false};
    case 'ERROR':
      return { loading: false, error: action.errorMessage};
    case 'CLEARERROR':
      return { ...currentHttpState, error: null};
    default: throw new Error('Should not reached');
  }
};

const Ingredients = (props) => {
  // const [userIngredients, setUserIngredients] = useState([]);
  const [ userIngredients, dispatch ] = useReducer(ingredientsReducer, []);
  // const [ isLoading, setIsLoading ] = useState(false);
  // const [ errorMessage, setErrorMessage ] = useState();
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, {});

  // Nếu không có Search get data thì dùng useEffect để get data từ server về! Ở project này ta đã có Search nên không cần lấy data lần nữa!

  const addIngredientHandler = (ingredient) => {
    dispatchHttp({type: 'STARTSEND'});
    fetch(`https://udemy-react-hook-task6.firebaseio.com/ingredients.json`, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ]);
      dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ingredient }});
      dispatchHttp({type: 'RESPONSE'});
    }).catch(error => {
      alert(error);
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong'});
    });
  };

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({type: 'STARTSEND'});
    fetch(`https://udemy-react-hook-task6.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      // setUserIngredients(prevIngredients => {
      //   return prevIngredients.filter((item) => item.id !== ingredientId);
      // });
      dispatch({type: 'DELETE', id: ingredientId});
      dispatchHttp({type: 'RESPONSE'});
    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong'});
    });
  };

  const filteredIngredientsHandler = useCallback(filterdIngredients => {
    dispatch({type: 'SET', ingredients: filterdIngredients});
  }, []);

  const clearError = () => {
    dispatchHttp({type: 'CLEARERROR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredient={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
