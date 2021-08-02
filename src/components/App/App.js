import React, { useState, useEffect } from 'react';
import { getTips, addTip, deleteTip, updateRating } from '../../ApiCalls';
import TipJar from '../TipJar/TipJar';
import Form from '../Form/Form';
import Error from '../Error/Error';
import Loader from '../Loader/Loader';
import './App.css';
import { Route, NavLink, Switch, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [advice, setAdvice] = useState([]);
  const [error, setError] = useState('');
  const [modButton, setModButton] = useState("mod-button");
  let timer;

  const fetchData = async () => {
    setError('');

    try {
      const result = await getTips();
      setAdvice(result.rows);
    } catch (error) {
      setError('Oops, problem loading tips. Please refresh the page.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTip = (newTip) => {
    setAdvice([...advice, newTip])
    addTip(newTip)
    .then(() => {
      fetchData()
    })
    if (advice.length) {
      setError('');
    }
  }    

  const handleRating = (rating, id) => {
    const updatedAdvice = advice.map( (tip) => {
      if(tip.id === id) { 
        tip.rating = rating
      }
      return tip
    })
    setAdvice(updatedAdvice)
    updateRating(rating, id)
  }
  
  const validateInputs = (title, description) => {  
    if (!title || !description) {
      setError('Please fill out title & description fields.')
      timer = setTimeout(() => setError(''), 5000)
    } else {
      setError('')
    }
  } 

  const evaluateLoaderAndError = () => {
    if (error && !advice.length) {
      return <Error error={error} />
    } else if (!advice.length && !error) {
       return <Loader/>
    } else {
      return <TipJar handleRating={handleRating} handleDelete={handleDelete} tips={ advice } />
    }
  }

  const handleDelete = (id) => {
    const filtered = advice.filter(tip => tip.id !== id)
    setAdvice(filtered)
    deleteTip(id)
    !filtered.length &&
      setError('Oh no! All out of advice! Please contribute your tip to our tip jar.');
  }

  const toggleClass = () => {
    if (modButton === "mod-button") {
      setModButton("mod-button-show") 
    } else {
      setModButton("mod-button");
    }
  }

  return (
    <main className='main'>
      <header className='nav-header'>
        <Link to='/'><h1>Turing Tip Jar</h1></Link>
        <div className="right-nav">
        <FontAwesomeIcon onClick={toggleClass} className="fa-2x hamburger" icon={faBars}/>
        <NavLink to='/module/1' activeClassName='nav-button' className={modButton}>Module 1</NavLink>
        <NavLink to='/module/2' activeClassName='nav-button' className={modButton}>Module 2</NavLink>
        <NavLink to='/module/3' activeClassName='nav-button' className={modButton}>Module 3</NavLink>
        <NavLink to='/module/4' activeClassName='nav-button' className={modButton}>Module 4</NavLink>
        <NavLink exact to='/' activeClassName='nav-button' className={modButton}>Show All</NavLink>
        </div>
      </header>
      <Form handleAddTip={handleAddTip} validateInputs={validateInputs}/>
      {error === 'Please fill out title & description fields.' 
      && <Error error={error}/>}
      <Switch>
        <Route exact path='/' render={() => {
          return (
            evaluateLoaderAndError()
          )
        }}/>
        <Route exact path='/module/:num' render={({match}) => {
          let selectedMod =  parseInt(match.params.num)
          let filtered = advice.filter(tip => tip.mod === selectedMod)
          return (
            <TipJar handleRating={handleRating} handleDelete={handleDelete} tips={filtered}/>
          )
        }}/>
        <Route path='/' render={() => 
          <Error error={'404 Not Found'} />
        }/>
      </Switch>
    </main>
  )
};

export default App

App.propTypes = {
  advice: PropTypes.array,
  error: PropTypes.string,
  handleDelete: PropTypes.func,
  handleRating: PropTypes.func,
  validateInputs: PropTypes.func
};