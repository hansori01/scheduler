import React from 'react';
import classNames from 'classnames/bind';

import 'components/DayListItem.scss';

function formatSpots(spots) {
  if (spots > 1) {
    return spots + ' spots remaining';
  } else if (spots === 1) {
    return spots + ' spot remaining';
  }
  return 'no spots remaining';
};

export default function DayListItem(props) {
  const DayListItemClass = classNames({
    "day-list__item": true,
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots,
  });

  return (
    <li
      className={DayListItemClass}
      onClick={() => props.setDay(props.name)}
      data-testid='day'
    >
      <h2 >{props.name}</h2>
      <h3>{formatSpots(props.spots)}</h3>
    </li>
  );
}
