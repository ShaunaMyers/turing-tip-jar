import React, {useState} from 'react';
import './TipCard.css';
import PropTypes from 'prop-types';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Tip = ({ rating, id, title, description, mod, date, handleDelete, handleRating, error}) => {
  
  // const [message, setMessage] = useState('');
  const [cardId, setId] = useState('')

  let timer;

  const onRating = (value, id) => {
    setId(id)
    handleRating(value, id)
    // setMessage('You have successfully rated this tip')
    timer = setTimeout(() => setId(''), 1000)
  }

  const onDelete = () => {
    setId(id)
    handleDelete(id)
    timer = setTimeout(() => setId(''), 1000)
  }

  return (
    <article className='tip-card'>
      <div className={`styling-box mod-${mod}`}>
      <p className="mod-text">Mod {mod}</p>
      </div>
      <h2>{title}</h2>
      <hr />
      <p className="description">{description}</p>
      <div className='rating-details'>
      <p>Your Rating:</p>
      <p><Rating onClick={(value) => onRating(value, id)}
      emptySymbol={<FontAwesomeIcon icon={faStar} size="2x" className='empty-star'/>}
      fullSymbol={<FontAwesomeIcon icon={faStar} size="2x" className='filled-star' />}
      placeholderSymbol={<FontAwesomeIcon icon={faStar} size="2x" className='filled-star' />}
      placeholderRating={rating}
      /></p>
      {error.includes('rated') || error.includes('rating') && cardId === id && <p className="message-text">{error}</p>}
      </div>
      <p>Date Submitted: {date}</p>
      <button onClick={(e) => {onDelete()}} className='delete'>Delete</button>
      {/* {error.includes('rating') && <p className="message-text">{error}</p>} */}
      {error === 'Error: Your delete request was not successful' && cardId === id && <p className="message-text">{error}</p>}
    </article>
  )
}

export default Tip;

Tip.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  mod: PropTypes.number,
  rating: PropTypes.number,
  date: PropTypes.string,
  handleDelete: PropTypes.func,
  message: PropTypes.string,
  error: PropTypes.string
}