const BOSS_LEVEL = 5;

const glyphIcons = {
  player: 'glyphicon-user',
  enemy: 'glyphicon-asterisk',
  boss: 'glyphicon-king',
  stalker: 'glyphicon-piggy-bank',
  health: 'glyphicon-heart',
  weapon: 'glyphicon-wrench',
  exit: 'glyphicon-modal-window'
}

const boardPieceTypes = {
  wall: 0,
  enemy: 1,
  weapon: 2,
  health: 3,
  potion: 4
};

const weapons = [
  {
    entityName: 'Staff',
    entityType: 'weapon',
    health: 0,
    attack: 15
  },
  {
    entityName: 'Hammer',
    entityType: 'weapon',
    health: 0,
    attack: 20
  },
  {
    entityName: 'Hanzo Sword',
    entityType: 'weapon',
    health: 0,
    attack: 30
  },
  {
    entityName: 'Blades of Chaos',
    entityType: 'weapon',
    health: 0,
    attack: 40
  },
  {
    entityName: 'Dragon Spear',
    entityType: 'weapon',
    health: 0,
    attack: 50
  }
];

// enemy attacks and health are the board level + 1 times these constants
const MULTIPLIERS = {
  ENEMY: {
    health: 15,
    attack: 15,
    xp: 10
  },
  PLAYER: {
    baseHealth: 100,
    health: 5,
    attack: 10,
    toNextLevel: 60
  }
};

// w = wall; f = open floor
const tileType = { w: 0, f: 1};
const tileTypeKey = ['w', 'f'];

// Damage needs to be somewhat random within a range per specs.
const DAMAGE_RANGE = 5;

/****************************** REDUX functions ***********************************/
// REDUX Bound Action Creators
function setMap(wallsOrTilesStore) {
  store.dispatch({type: 'SET_MAP', wallsOrTilesStore: wallsOrTilesStore});
}
function resetMap(wallsOrTilesStore) {
  store.dispatch({type: 'RESET_MAP', wallsOrTilesStore: wallsOrTilesStore});
}
function addActor(entityName, entityType, health, attack, location) {
  store.dispatch({type: 'ADD_ACTOR', entityName: entityName, entityType: entityType, health: health, attack: attack, location: location});
}
function inflictDamage(entity, value) {
  store.dispatch({type: 'INFLICT_DAMAGE', entityName: entity, value: value});
}
function addHealth(entity, health) {
  store.dispatch({type: 'ADD_HEALTH', entityName: entity, value: health});
}
function move(entity, vector) {
  store.dispatch({type: 'MOVE', entityName: entity, vector: vector});
}
function setEntityLocation(entity, location) {
  store.dispatch({type: 'SET_LOCATION', entityName: entity, location: location});
}
function switchWeapon(weaponName, attack) {
  store.dispatch({type: 'SWITCH_WEAPON', weapon: weaponName, attack: attack});
}
function removeEntity(entityName) {
  store.dispatch({type: 'REMOVE_ENTITY', entityName: entityName});
}
function resetBoard() {
  store.dispatch({type: 'RESET_BOARD'});
}
function goToNextBoardLevel() {
  store.dispatch({type: 'NEXT_BOARD_LEVEL'});
}
function detectWindowSize() {
  store.dispatch({type: 'DETECT_WINDOW_SIZE',
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  });
}
function addPlayerXp(xp) {
  store.dispatch({type: 'ADD_XP_TO_PLAYER', xp: xp});
}
function levelUpPlayer(attack, health, xp) {
  store.dispatch({type: 'LEVEL_UP_PLAYER',
    attack: attack,
    health: health,
    toNextLevel: xp
  });
}
function addBoss(attack, health, coords) {
  store.dispatch({type: 'ADD_BOSS', attack: attack, health: health, location: coords});
}
function toggleUserVisibility() {
  store.dispatch({type: 'TOGGLE_USER_VISIBILITY'});
}

// REDUX Initial State
const initialState = {
  // entities is an map of ids to object describing the entity
  entities: {
    'player': {
      entityType: 'player',
      x: 0,
      y: 0,
      health: 100,
      inventory: {},
      weapon: 'fists',
      attack: 10,
      playerLevel: 1,
      xp: 0,
      toNextLevel: 60
    }
  },
  // Link occupied space with entity id
  filledTiles: {
    '0-0': 'player'
  },
  wallsOrTilesStore: [],
  boardLevel: 1,
  windowHeight: 500,
  windowWidth: 500,
  userInDark: true
};

// Redux Reducers
function gameReduxReducers(state = initialState, action) {
  // * We will use the ES6 spread operator to copy in attributes "..."
  // * omit is from underscore. It return copy of object, filtered to omit the blacklisted keys. 
  //   Alternatively accepts a predicate indicating which keys to omit.

  // Each of these is just returning a new state the program should be in. It copies all state attributes using spread
  //   and then just alters the values desired.
  switch (action.type) {
    case 'SET_MAP':
      return {
        ...state,
        wallsOrTilesStore: action.wallsOrTilesStore
      };    
    case 'ADD_ACTOR':
      return {
        ...state,
        filledTiles: {
          // Add currently filled tiles
          ...state.filledTiles,
          // Add this new actor at location of x-y coords and assign the entity name
          [`${action.location.x}-${action.location.y}`]: action.entityName
        },
        entities: {
          // Add new entity to entities array to track number on board
          ...state.entities,
          [action.entityName]: {
            entityType: action.entityType,
            health: action.health,
            attack: action.attack,
            x: action.location.x,
            y: action.location.y
          }
        }
      };

    case 'INFLICT_DAMAGE':
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            health: state.entities[action.entityName].health - action.value
          }
        }
      };
    case 'ADD_HEALTH':
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            health: state.entities.player.health + action.value
          }
        }
      };
    case 'SWITCH_WEAPON':
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            weapon: action.weapon,
            attack: action.attack
          }
        }
      };
    case 'MOVE':
      return {
        ...state,
        filledTiles: _.chain(state.filledTiles)
                          .omit(`${state.entities[action.entityName].x}-${state.entities[action.entityName].y}`)
                          .set(`${state.entities[action.entityName].x + action.vector.x}-${state.entities[action.entityName].y + 
                            action.vector.y}`,action.entityName)
                          .value(),
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            x: state.entities[action.entityName].x + action.vector.x,
            y: state.entities[action.entityName].y + action.vector.y
          }
        }
      };
    case 'SET_LOCATION':
      return {
        ...state,
        filledTiles: _.chain(state.filledTiles)
                          .omit(`${state.entities[action.entityName].x}-${state.entities[action.entityName].y}`)
                          .set(`${action.location.x}-${action.location.y}`, action.entityName)
                          .value(),
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            x: action.location.x,
            y: action.location.y
          }
        }
      };
    case 'REMOVE_ENTITY':
      return {
        ...state,
        filledTiles: _.chain(state.filledTiles)
                          .omit(`${state.entities[action.entityName].x}-${state.entities[action.entityName].y}`)
                          .value(),
        entities: _.chain(state.entities)
                    .omit(action.entityName)
                    .value()
      };
    case 'RESET_BOARD':
      return {
        ...state,
        entities: {
          'player': state.entities.player
        },
        filledTiles: {
          [`${state.entities.player.x}-${state.entities.player.y}`]: 'player'
        }
      };
    case 'NEXT_BOARD_LEVEL':
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player
          }
        },
        boardLevel: state.boardLevel + 1
      };
    case 'DETECT_WINDOW_SIZE':
      return {
        ...state,
        windowHeight: action.windowHeight,
        windowWidth: action.windowWidth
      };
    case 'ADD_XP_TO_PLAYER':
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            toNextLevel: state.entities.player.toNextLevel - action.xp,
            xp: state.entities.player.xp + action.xp
          }
        }
      };
    case 'LEVEL_UP_PLAYER':
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            attack: state.entities.player.attack + action.attack,
            health: state.entities.player.health + action.health,
            toNextLevel: action.toNextLevel,
            playerLevel: state.entities.player.playerLevel + 1
          }
        }
      };
    case 'RESET_MAP':
      return {
        ...initialState,
        wallsOrTilesStore: action.wallsOrTilesStore
      };
    case 'ADD_BOSS':
      return {
        ...state,
        filledTiles: {
          ...state.filledTiles,
          [`${action.location.x}-${action.location.y}`]: 'boss',
          [`${action.location.x + 1}-${action.location.y}`]: 'boss',
          [`${action.location.x}-${action.location.y + 1}`]: 'boss',
          [`${action.location.x + 1}-${action.location.y + 1}`]: 'boss'
        },
        entities: {
          ...state.entities,
          boss: {
            entityType: 'boss',
            isBoss: 1,
            health: action.health,
            attack: action.attack,
            x: action.location.x,
            y: action.location.y
          }
        }
      };
    case 'TOGGLE_USER_VISIBILITY':
      return {
        ...state,
        userInDark: !state.userInDark
      };
    default:
      return state;
  }
  return state;
}

// REDUX Store for game data
let store = Redux.createStore(gameReduxReducers);

// ***************** END REDUX CODE ********************

// Game Component
const DragonSlayer = React.createClass({
  propTypes: {
    getState: React.PropTypes.func.isRequired,
    mapFunc: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return this.retrieveBoardState(this.props.getState());
  },
  componentWillMount: function() {
    this.generateBoard();
  },
  componentDidMount: function() {
    this.updateBoardFromState();
    this.unsubscribe = store.subscribe(this.updateBoardFromState);
    window.addEventListener('keydown', this.userPressedKey);
  },
  componentWillUnmount: function() {
    this.unsubscribe();
    window.removeEventListener('keydown', this.userPressedKey);
  },
  updateBoardFromState: function() {
    const newState = this.props.getState()
    // Should player level up?
    if (newState.entities.player.toNextLevel <= 0) this.playerLeveledUp();
    this.setState(this.retrieveBoardState(newState));
  },
  retrieveBoardState: function(state) {
    return {
      player: state.entities.player, entities: state.entities, wallsOrTilesStore: state.wallsOrTilesStore, filledTiles: state.filledTiles,
      boardLevel: state.boardLevel, userInDark: state.userInDark, windowHeight: state.windowHeight, windowWidth: state.windowWidth      
    }
  },
  playerLeveledUp: function() {
    const currLevel = this.state.player.playerLevel + 1;
    levelUpPlayer(currLevel * MULTIPLIERS.PLAYER.attack, currLevel * MULTIPLIERS.PLAYER.health, (currLevel + 1) * MULTIPLIERS.PLAYER.toNextLevel);
  },
  generateBoard: function() {
    resetMap(this.props.mapFunc());
    this.placeItemsOnMap()
    this.updateBoardFromState();
    detectWindowSize();
  },
  findEmptyTiles: function() {
    const {wallsOrTilesStore, filledTiles} = this.props.getState();
    let loc, x, y;
    do {
      x = Math.floor(Math.random() * wallsOrTilesStore.length);
      y = Math.floor(Math.random() * wallsOrTilesStore[0].length);
      if (wallsOrTilesStore[x][y] === tileType.f && !filledTiles[x + '-' + y]) {
        loc = {x: x, y: y};
      }
    } while (!loc);
    return loc;
  },
  placeItemsOnMap: function() {
    // Place player on the map
    setEntityLocation('player', this.findEmptyTiles());

    // Place items
    const state = this.props.getState();
    const weapon = weapons[state.boardLevel - 1];
    addActor(weapon.entityName, 'weapon', weapon.health, weapon.attack, this.findEmptyTiles());

    // Place health and enemies
    const NUM_THINGS = 7, HEALTH_VAL = 20, LEVEL_MULTIPLIER = state.boardLevel + 1;

    for (let i = 0; i < NUM_THINGS; i++) {
      // Make health and enimies have stronger values for each level
      addActor('health'+i, 'health', HEALTH_VAL * LEVEL_MULTIPLIER, 0, this.findEmptyTiles());
      addActor('enemy'+i, 'enemy', LEVEL_MULTIPLIER * MULTIPLIERS.ENEMY.health, LEVEL_MULTIPLIER * MULTIPLIERS.ENEMY.attack, this.findEmptyTiles());      
    }

    // Place exit if not last level
    if (state.boardLevel < BOSS_LEVEL) addActor('exit', 'exit', 0, 0, this.findEmptyTiles());

    // Place boss on last (fifth) level
    if (state.boardLevel === BOSS_LEVEL) addBoss(125, 500, this.findEmptyTiles());
  },
  addMoves: function(coords, moves) {
    return {x: coords.x + moves.x, y: coords.y + moves.y};
  },
  toggleVisibility: function() {
    toggleUserVisibility();
  },
  toggleKey: function () {
    let el = document.getElementById("key");

    if (el.className.match(/(?:^|\s)hidden(?!\S)/)) {
      // toggle to display it
      el.classList.remove("hidden");
    }
    else {
      // It is showing, hide it.
      el.className += " hidden";
    }
  },
  userPressedKey: function(e) {
    let moves = '';
    switch (e.keyCode) {
      case 37:
        moves = {x: -1, y: 0};
        break;
      case 38:
        moves = {x: 0, y: -1};
        break;
      case 39:
        moves = {x: 1, y: 0};
        break;
      case 40:
        moves = {x: 0, y: 1};
        break;
      default:
        moves = '';
        break;
    }
    if (moves) {
      e.preventDefault();
      this.movePlayer(moves);
    }
  },
  movePlayer: function(moves) {
    const state = this.props.getState();
    const player = state.entities.player;
    const wallsOrTilesStore = state.wallsOrTilesStore;
    const newPlayerLocation = this.addMoves({x: player.x, y: player.y}, moves);

    if ((newPlayerLocation.x > 0 && newPlayerLocation.y > 0) && 
        (newPlayerLocation.x < wallsOrTilesStore.length) &&
        (newPlayerLocation.y < wallsOrTilesStore[0].length) &&
        (wallsOrTilesStore[newPlayerLocation.x][newPlayerLocation.y] !== tileType.w)) {

      // This location is not part of a wall, so check if it already has an entity
      const entityName = state.filledTiles[newPlayerLocation.x + '-' + newPlayerLocation.y];

      // move and return if empty
      if (!entityName) {
        move('player', moves);
        return;
      }

      // handle encounters with entities
      const entity = state.entities[entityName];
      switch (entity.entityType) {
        case 'weapon':
          switchWeapon(entityName, entity.attack);
          showGameMessage("SUCCESS", "NEW WEAPON UNLOCKED: " + entityName, 2000);
          move('player', moves);
          break;
        case 'boss':
        case 'enemy':
          const playerAttack = Math.floor((Math.random() * DAMAGE_RANGE) + player.attack - DAMAGE_RANGE);
          const enemyAttack = Math.floor((Math.random() * DAMAGE_RANGE) + entity.attack - DAMAGE_RANGE);
          // Will hit kill enemy?
          if (entity.health > playerAttack) {
            // Will rebound hit kill player?
            if (enemyAttack > player.health) {
              showGameMessage("ERROR", "You have been killed. Try again.", 5000);
              this.generateBoard();
              return;
            }
            inflictDamage(entityName, playerAttack);
            inflictDamage('player',enemyAttack);

            showGameMessage("BATTLE", "You were dealt damage of: " + entity.attack, 1000);
            showGameMessage("BATTLE", "Enemy Health Remaining: " + entity.health, 1000);
          } else {
            // Is the enemy a boss?
            if (entityName === 'boss') {
              showGameMessage("SUCCESS", "You have defeated the dragon!", 2000);
              this.generateBoard();
              return;
            }
            showGameMessage("SUCCESS", "ENEMY DEFEATED! " + (state.boardLevel + 1) * MULTIPLIERS.ENEMY.xp + " XP AWARDED", 2000);
            addPlayerXp((state.boardLevel + 1) * MULTIPLIERS.ENEMY.xp);
            removeEntity(entityName);
          }
          break;
        case 'health':
          addHealth('player', entity.health);
          showGameMessage("SUCCESS", entity.health + " health points added", 2000);
          removeEntity(entityName);
          move('player', moves);
          break;
        case 'exit':
          resetBoard();
          setMap(this.props.mapFunc());
          setEntityLocation('player', this.findEmptyTiles());          
          goToNextBoardLevel();
          showGameMessage("SUCCESS", "NEXT LEVEL!", 2000);
          this.placeItemsOnMap();
          break;
        default:
          break;
      }
    }
  },

  render: function() {
    const {wallsOrTilesStore, entities, filledTiles, boardLevel, player, windowHeight,
           windowWidth, winner, userInDark} = this.state, VISIBILTY = 10,
          // This should match the css height and width in pixels
          tileSize = document.getElementsByClassName('tile').item(0) ? document.getElementsByClassName('tile').item(0).clientHeight : 11;
    
    // Get start coords for current viewport
    const numCols = Math.floor((windowWidth / tileSize)),
          numRows = Math.floor((windowHeight/ tileSize) - 17);

    let startX = Math.floor(player.x - (numCols/2));
    let startY = Math.floor(player.y - (numRows/2));

    // Make sure start isn't less than 0
    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;

    // Set end coords
    let endX = startX + numCols;
    let endY = startY + numRows;

    // Final validation of start and end coords
    if (endX > wallsOrTilesStore.length) {
      startX = numCols > wallsOrTilesStore.length ? 0 : startX - (endX - wallsOrTilesStore.length);
      endX = wallsOrTilesStore.length;
    }
    
    if (endY > wallsOrTilesStore[0].length) {
      startY = numRows > wallsOrTilesStore[0].length ? 0 : startY - (endY - wallsOrTilesStore[0].length);
      endY = wallsOrTilesStore[0].length;
    }

    // Create visible gameboard
    let rows = [], tileClass, glyphIcon, row;

    for (let y = startY; y < endY; y++) {
      row = [];
      for (let x = startX; x < endX; x++) {
        let entity = filledTiles[`${x}-${y}`];

        if (!entity) {
          tileClass = tileTypeKey[wallsOrTilesStore[x][y]];
          glyphIcon = "";
        } else {
          tileClass = entities[entity].entityType;
          glyphIcon = glyphIcons[tileClass];
        }
        if (userInDark) {
          // check if it should be dark
          const xDiff = player.x - x,
                yDiff = player.y - y;

          if (Math.abs(xDiff) > VISIBILTY || Math.abs(yDiff) > VISIBILTY) {
            tileClass += ' dark';
          } else if (Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) >= VISIBILTY) {
            tileClass += ' dark';
          }
        }
        row.push(React.createElement('div', {className: 'glyphicon tile ' + tileClass + ' ' + glyphIcon, key: x + '-' + y}, ' '));
      }
      rows.push(React.createElement('div', {className: 'boardRow', key: 'row' + y}, row))
    }

    return (
      <div id="game">
        <div className="gamestatus-header row">
          <div className="col-md-1 text-center">Health:<br/>{player.health}</div>
          <div className="col-md-2 text-center">Current Weapon:<br/>{player.weapon}</div>
          <div className="col-md-2 text-center">Attack Strength:<br/>{player.attack}</div>
          <div className="col-md-2 text-center">Level:<br/>{boardLevel}</div>
          <div className="col-md-2 text-center">Current XP:<br/>{player.xp}</div>
          <div className="col-md-2 text-center">XP To Next Level:<br/>{player.toNextLevel}</div> 
          <div className="col-md-1 text-center">

            <ToggleGlyphButton
              id='toggleUserVisibilityBtn'
              glyphClass='glyphicon-eye-open'
              titleText="Toggle Darkness"
              handleClick={this.toggleVisibility} />

            <ToggleGlyphButton
              id='toggleKey'
              glyphClass='glyphicon-question-sign'
              titleText="Toggle Help Menu"
              handleClick={this.toggleKey} />  

          </div>                             
        </div>
        <div id="key" className="hidden">
          <div className="col-md-2 text-center">Your player:<br/><span className="player glyphicon glyphicon-user"></span></div>
          <div className="col-md-2 text-center">Health:<br/><span className="health glyphicon glyphicon-heart"></span></div>  
          <div className="col-md-2 text-center">Enemy:<br/><span className="enemy glyphicon glyphicon-asterisk"></span></div>
          <div className="col-md-2 text-center">Weapon Upgrade:<br/><span className="weapon glyphicon glyphicon-wrench"></span></div>
          <div className="col-md-2 text-center">Enter Next Level:<br/><span className="exit glyphicon glyphicon-modal-window"></span></div>
          <div className="col-md-2 text-center">Boss:<br/><span className="boss glyphicon glyphicon-king"></span></div>            
        </div>
        <div id="board">
          {rows}
        </div>
      </div>
    );
  }
});

const ToggleGlyphButton = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    glyphClass: React.PropTypes.string.isRequired,
    titleText: React.PropTypes.string,
    handleClick: React.PropTypes.func.isRequired
  },
  render: function() {
    let buttonClass = "toggleButton glyphicon " + this.props.glyphClass;
    return (
      <button
        className={buttonClass}
        title={this.props.titleText}
        id={this.props.id}
        onClick={this.props.handleClick}>
      </button>
    );
  }
});

ReactDOM.render(
  <DragonSlayer mapFunc={createMap} getState={store.getState}/>, document.getElementById("game-container")
);

// function that handles messages to our user.
function showGameMessage(status, message, duration) {
  humane.log(message, { timeout: duration, addnCls: 'humane-message-' + status });
}

// This function will create a store holding every cell on the map. It will either have a 0 for Wall, or 1 for Floor
// Returns a matrix of the given dimensions with the number of rooms specified
// Uses ES6 Defaults to initialize any values that aren't passed in.
function createMap(width = 100, height = 100, maxRoomSize = 20, minRoomSize = 6, maxHallLength = 5, numRooms = 20, roomChance = .75) {
  // initialize a grid of walls

  // _fill is a lodash function that will fill elements of array with value from start up to, but not including, end.
  let wallsOrTilesStore = _.fill(Array(width), 0);
  const blankCol = _.fill(Array(height), tileType.w);
  wallsOrTilesStore = wallsOrTilesStore.map(() => blankCol.slice());
  
  // create first room
  fillRect(wallsOrTilesStore, {x: 45, y: 45}, {x: 10, y: 10}, tileType.f);
  
  // create rooms
  for (let i = 0; i < numRooms; i++) {
    placeRoom(wallsOrTilesStore);
  }
  return wallsOrTilesStore;
  
  // wallsOrTilesStore is a grid, startCoord is an object like {x: 13, y: 15}
  // size is an object like {x: 5, y: 7}, fillVal is an int
  function fillRect(wallsOrTilesStore, startCoord, size, fillVal) {
    for (let i = startCoord.x; i < startCoord.x + size.x; i++) {
      _.fill(wallsOrTilesStore[i], fillVal, startCoord.y, size.y + startCoord.y);
    }
    return wallsOrTilesStore;
  }
  
  // Will keep trying to place random rooms in random places until it succeeds.
  function placeRoom(wallsOrTilesStore) {
    let wall, width, height, isRoom, startX, startY, coords, numClear;
    while (true) {
      // Create random location and room
      // TODO - Choose wall or hall
      numClear = 0;
      wall = getCompassHeadingNextWall(wallsOrTilesStore);
      coords = wall.coords;
      width = Math.floor((Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize);
      height = Math.floor((Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize);
      switch (wall.openDir) {
        case 'E':
          startX = coords.x - width;
          startY = (coords.y - Math.floor(height / 2)) + getDoorOffset(height);
          break;
        case 'W':
          startX = coords.x + 1;
          startY = (coords.y - Math.floor(height / 2)) + getDoorOffset(height);
          break;
        case 'N':
          startX = (coords.x - Math.floor(width / 2)) + getDoorOffset(width);
          startY = coords.y + 1;
          break;
        case 'S':
          startX = (coords.x - Math.floor(width / 2)) + getDoorOffset(width);
          startY = coords.y - height;
          break;
        default:
          break;
      }
      // Exit if room would be outside matrix
      if (startX < 0 || startY < 0 || startX + width >= wallsOrTilesStore.length || startY + height >= wallsOrTilesStore[0].length) {
        continue;
      }
      // check if all spaces are clear
      for (let i = startX; i < startX + width; i++) {
        if (wallsOrTilesStore[i].slice(startY, startY + height).every(tile => tile === tileType.w)) {
          numClear++;
        }
      }
      if (numClear === width) {
        fillRect(wallsOrTilesStore, {x: startX, y: startY}, {x: width, y: height}, tileType.f);
        wallsOrTilesStore[coords.x][coords.y] = 1;
        return wallsOrTilesStore;
      }
    }
    
    function getDoorOffset(length) {
      return Math.floor((Math.random() * length) - Math.floor((length - 1 ) / 2));
    }
  }

  // Takes a wallsOrTilesStore matrix and a coordinate object
  // Returns false if not a wall, otherwise the direction of the open tile
  function isWallOtherwiseDirectionToOpenTile(wallsOrTilesStore, coords) {
    // return 0 this board spot is not a wall
    if (wallsOrTilesStore[coords.x][coords.y] !== tileType.w) { return 0; }
    // No walls West
    if (typeof wallsOrTilesStore[coords.x - 1] !== 'undefined' && wallsOrTilesStore[coords.x - 1][coords.y] === tileType.f) return 'W';
    // No walls East
    if (typeof wallsOrTilesStore[coords.x + 1] !== 'undefined' && wallsOrTilesStore[coords.x + 1][coords.y] === tileType.f) return 'E';
    // No walls North
    if (wallsOrTilesStore[coords.x][coords.y - 1] === tileType.f) return 'N';
    // No walls South
    if (wallsOrTilesStore[coords.x][coords.y + 1] === tileType.f) return 'S';
    return 0;
  }  
  
  // Loops until it finds a wall tile and returns compass heading of that wall
  function getCompassHeadingNextWall(wallsOrTilesStore) {
    const loc = {x: 0, y: 0};
    let directionOfNextWall = 0;

    while (!directionOfNextWall) {
      loc.x = Math.floor(Math.random() * wallsOrTilesStore.length);
      loc.y = Math.floor(Math.random() * wallsOrTilesStore[0].length);
      directionOfNextWall = isWallOtherwiseDirectionToOpenTile(wallsOrTilesStore, loc);
    }
    return {coords: loc, openDir: directionOfNextWall};
  }
}
