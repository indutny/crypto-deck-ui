'use strict';

const React = require('react');

const ui = require('../../ui');
const Card = ui.containers.Card;
const DropTarget = ui.components.DropTarget;

class Player extends DropTarget {
  render() {
    const props = this.props;
    const className = `player ${props.isSelf ? 'player-self' : ''}`;
    const you = props.isSelf ? '(you)' : '';
    return <section className={className}
                    data-index={props.index}
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e)}>
      <div className="player-name">Player {props.index} {you}</div>
      {
        props.cards.map((card) => {
          return <Card key={card.id}
                       card={card}
                       forceDown={!props.isSelf}
                       draggable={props.isSelf}/>;
        })
      }
      <div className="clear"></div>
    </section>;
  }

  canDrop() {
    return this.props.isSelf;
  }

  handleDrop(data) {
    if (data.type === 'deck')
      this.props.onDeckDrop(data);
    else if (data.type === 'card')
      this.props.onCardDrop(data);
  }
}
module.exports = Player;
