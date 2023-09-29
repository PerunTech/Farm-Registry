import { React, connect, PropTypes } from "perun-core";
import style from '../style/ERZS.module.css'
import getERZSCards from './ErszCards'

class ERZS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardsItems: getERZSCards()
    };
  }

  componentDidMount() {
    this.iterateCards(this.state.cardsItems);
  }

  iterateCards = (cardsItems) => {
    let htmlElement
    let elementArr = []
    let cards = cardsItems.navigation.cards
    for (let i = 0; i < cards.length; i++) {
      htmlElement = <div className={style['card']}>
        <p className={`${style['card-title']}`} key={cards[i].id} id={cards[i].id}>{cards[i].labelCode}</p>
        <p style={{ fontWeight: 'bold', fontSize: '35px' }}>{cards[i].value}</p>
      </div>
      elementArr.push(htmlElement)
    }
    this.setState({ generateElement: elementArr })
  }


  render() {
    const { generateElement } = this.state
    return (
      <div className={`${style['erzs']}`}>
        <div className={`${style['title']}`}>
          <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{this.context.intl.formatMessage({ id: 'perun.farm_registry.unique_agricultural_holding_identifier', defaultMessage: 'perun.farm_registry.unique_agricultural_holding_identifier' })}</p>
          <p style={{ marginTop: '-1%' }}>{this.context.intl.formatMessage({ id: 'perun.farm_registry.logged_in_user', defaultMessage: 'perun.farm_registry.logged_in_user' })}:</p>
        </div>
        <div id="erzs-container" className={`${style['erzs-container']}`} >
          <div id='erzs-holder' className={`${style['erzs-holder']}`}>
            {generateElement}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

ERZS.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ERZS);
