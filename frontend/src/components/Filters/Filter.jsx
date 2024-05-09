import React, { useState } from 'react';
import styles from './Filter.module.css'; // Changed module name
import allImage from '../../assets/images/all.jpg';
import foodImage from '../../assets/images/food.jpg';
import healthImage from '../../assets/images/health.jpg';
import moviesImage from '../../assets/images/movies.jpg';
import travelImage from '../../assets/images/travel.jpg';
import educationImage from '../../assets/images/education.jpg';
import { getAll } from '../../apis/storyApis';

const Filter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('All'); // State to keep track of selected filter

  const handleFilterClick =async (category) => {
    onFilterChange(category);
    setSelectedFilter(category); // Update selected filter on click
    await getAll();
  };

  return (
    <div className={styles.filterContainer}>
      <div
        onClick={() => handleFilterClick('All')}
        className={`${styles['custom-filterbox']} ${selectedFilter === 'All' && styles.selected}`}
        style={{ backgroundImage: `url(${allImage})` }}
      >
        <span className={styles['custom-filtername']}>All</span>
      </div>
      <div
        onClick={() => handleFilterClick('Food')}
        className={`${styles['custom-filterbox']} ${selectedFilter === 'Food' && styles.selected}`}
        style={{ backgroundImage: `url(${foodImage})` }}
      >
        <span className={styles['custom-filtername']}>Food</span>
      </div>
      <div
        onClick={() => handleFilterClick('Health & Fitness')}
        className={`${styles['custom-filterbox']} ${selectedFilter === 'Health & Fitness' && styles.selected}`}
        style={{ backgroundImage: `url(${healthImage})` }}
      >
        <span className={styles['custom-filtername']}>Health & Fitness</span>
      </div>
      <div
        onClick={() => handleFilterClick('Travel')}
        className={`${styles['custom-filterbox']} ${selectedFilter === 'Travel' && styles.selected}`}
        style={{ backgroundImage: `url(${travelImage})` }}
      >
        <span className={styles['custom-filtername']}>Travel</span>
      </div>
      <div
        onClick={() => handleFilterClick('Movies')}
        className={`${styles['custom-filterbox']} ${selectedFilter === 'Movies' && styles.selected}`}
        style={{ backgroundImage: `url(${moviesImage})` }}
      >
        <span className={styles['custom-filtername']}>Movies</span>
      </div>
      <div
        onClick={() => handleFilterClick('Education')}
        className={`${styles['custom-filterbox']} ${selectedFilter === 'Education' && styles.selected}`}
        style={{ backgroundImage: `url(${educationImage})` }}
      >
        <span className={styles['custom-filtername']}>Education</span>
      </div>
    </div>
  );
};

export default Filter;
