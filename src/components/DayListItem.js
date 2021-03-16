import React from 'react';
import classNames from 'classnames/bind';

import 'components/DayListItem.scss';

export default function DayListItem(props) {

  const DayListItemClass = classNames({
    "day-list__item": true,
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots,
  });

  function formatSpots() {
    if (props.spots > 1) {
      return props.spots + ' spots remaining';
    } else if (props.spots === 1) {
      return props.spots + ' spot remaining';
    }
    return 'no spots remaining'
  }

  return (
    <li
      className={DayListItemClass}
      onClick={() => props.setDay(props.name)}
    >
      <h2 >{props.name}</h2>
      <h3>{formatSpots()}</h3>
    </li>
  )
}
