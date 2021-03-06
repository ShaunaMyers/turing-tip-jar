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
  const [timer, setTimer] = useState('')
  const [modButton, setModButton] = useState("mod-button");

  const fetchData = () => {
    setError('');
    getTips()
    .then(result => {
      if (!result.rows.length) {
        setError('Oh no! All out of advice! Please contribute your tip to our tip jar')
      } else {
        setAdvice(result.rows)
      }
    })
    .catch(err => {
      setError('Oops, problem loading tips. Please refresh the page.')
    })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const handleAddTip = (newTip) => {
    addTip(newTip)
    .then(() => {
      fetchData()
    })
    .catch(err => {
      setError(`${err}`)
      setTimer(setTimeout(() => setError(''), 5000))
    })
  }    

  const handleRating = (rating, id) => {
    updateRating(rating, id)
    .then(() => {
      const updatedAdvice = advice.map( (tip) => {
        if (tip.id === id) { 
          tip.rating = rating
        }
        return tip
      })
      setAdvice(updatedAdvice)
      setError('You have successfully rated this tip')
      setTimer(setTimeout(() => setError(''), 5000))
    })
    .catch(err => {
      setError(`${err}`)
      setTimer(setTimeout(() => setError(''), 5000))
    })
  }
  
  const validateInputs = (title, description) => {  
    if (!title || !description) {
      setError('Please fill out title & description fields.')
      setTimer(setTimeout(() => setError(''), 5000))
    } else {
      setError('')
    }
  } 

  const evaluateLoaderAndError = (filtered, selectedMod) => {
    let tips;
    !selectedMod ? tips = advice : tips = filtered
    if (!advice.length && !error) {
       return <Loader/>
    } else {
      return <TipJar handleRating={handleRating} handleDelete={handleDelete} tips={ tips } error = {error} selectedMod = {selectedMod}/>
    }
  }

  const handleDelete = (id) => {
    deleteTip(id)
    .then(() => {
      const filtered = advice.filter(tip => tip.id !== id)
      if (!filtered.length) {        
        setError('Oh no! All out of advice! Please contribute your tip to our tip jar')
      }
      setAdvice(filtered)
    })
    .catch(err => {
      setError(`${err}`)
      setTimer(setTimeout(() => setError(''), 5000))
    })
  }

  const doubledErrors = [
    'Oops, problem loading tips. Please refresh the page.',
    'Error: Your delete request was not successful',
    'Error: Your rating was not successful',
    'You have successfully rated this tip'
  ]

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
      {(!doubledErrors.includes(error)) && <Error error={error}/>}
      {error !== 'Oops, problem loading tips. Please refresh the page.'  
      ? <Switch>
          <Route exact path='/' render={() => {
            return (
              <>
                <Form handleAddTip={handleAddTip} validateInputs={validateInputs}/> 
                {evaluateLoaderAndError()}
              </>
            )
          }}/>
          <Route exact path='/module/:num' render={({match}) => {
            let selectedMod =  parseInt(match.params.num)
            let filtered = advice.filter(tip => tip.mod === selectedMod)
            return (
              <>
                <Form handleAddTip={handleAddTip} validateInputs={validateInputs}/> 
                {evaluateLoaderAndError(filtered, selectedMod)}
              </>
            )
          }}/>
          <Route path='/' render={() => 
            <Error error={'404 Not Found'} />
          }/>
        </Switch>
      : <Error error={error} />
      }
    </main>
  )
};

export default App

App.propTypes = {
  advice: PropTypes.array,
  error: PropTypes.string,
  timer: PropTypes.string,
  handleDelete: PropTypes.func,
  handleRating: PropTypes.func,
  validateInputs: PropTypes.func
};