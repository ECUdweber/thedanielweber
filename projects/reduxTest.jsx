const glyphIcons = {
  player: 'glyphicon-user',
  enemy: 'glyphicon-asterisk',
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

const tileType = {
  WALL: 0,
  FLOOR: 1
};

const reverseLookup = ['WALL', 'FLOOR'];

const weapons = [
  {
    entityName: 'Staff',
    entityType: 'weapon',
    health: 0,
    attack: 10
  },
  {
    entityName: 'Hammer',
    entityType: 'weapon',
    health: 0,
    attack: 15
  },
  {
    entityName: 'Hanzo Sword',
    entityType: 'weapon',
    health: 0,
    attack: 20
  },
  {
    entityName: 'Blades of Chaos',
    entityType: 'weapon',
    health: 0,
    attack: 30
  },
  {
    entityName: 'Dragon Spear',
    entityType: 'weapon',
    health: 0,
    attack: 50
  }
];

// enemy attacks and health are the dungeon level + 1 times these constants
const ENEMY = {
  health: 20,
  attack: 12,
  xp: 10
};

const PLAYER = {
  baseHealth: 100,
  health: 20,
  attack: 12,
  toNextLevel: 60
};

// Damage needs to be somewhat random within a range per specs.
const DAMAGE_RANGE = 5;

// function that handles messages to our user.
function showGameMessage(status, message) {
  alert("NEED SOMETHING TO SHOW MESSAGES.\nStatus: " + status + "\nMessage: " + message);
}

/****************************** REDUX code ***********************************/
// REDUX Bound Action Creators
function setMap(map) {
  store.dispatch({type: 'SET_MAP', map: map});
}
function resetMap(map) {
  store.dispatch({type: 'RESET_MAP', map: map});
}
function addActor(entityName, entityType, health, attack, location) {
  store.dispatch({type: 'ADD_ACTOR', entityName: entityName, entityType: entityType, health: health, attack: attack, location: location});
}

function inflictDamage(entity, value) {
  store.dispatch({type: 'INFLICT_DAMAGE', entityName: entity, value: value});
}
function heal(entity, health) {
  store.dispatch({type: 'HEAL', entityName: entity, value: health});
}
function move(entity, vector) {
  store.dispatch({type: 'MOVE', entityName: entity, vector: vector});
}
function setLocation(entity, location) {
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
function increaseLevel() {
  store.dispatch({type: 'INCREASE_LEVEL'});
}
function resetLevel() {
  store.dispatch({type: 'RESET_LEVEL'});
}
function setWindowSize() {
  store.dispatch({type: 'SET_WINDOW_SIZE',
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  });
}
function gainXp(xp) {
  store.dispatch({type: 'GAIN_XP', xp: xp});
}
function levelUp(attack, health, xp) {
  store.dispatch({type: 'LEVEL_UP',
    attack: attack,
    health: health,
    toNextLevel: xp
  });
}
function addBoss(attack, health, coords) {
  store.dispatch({type: 'ADD_BOSS', attack: attack, health: health, location: coords});
}
function toggleDarkness() {
  store.dispatch({type: 'TOGGLE_DARKNESS'});
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
      level: 0,
      toNextLevel: 60
    }
  },
  // Link occupied space with entity id
  filledTiles: {
    '0-0': 'player'
  },
  map: [],
  level: 0,
  windowHeight: 500,
  windowWidth: 500,
  darkness: true
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
        map: action.map
      };    
    case 'ADD_ACTOR':
      return {
        ...state,
        filledTiles: {
          ...state.filledTiles,
          [`${action.location.x}-${action.location.y}`]: action.entityName
        },
        entities: {
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
    case 'HEAL':
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
            attack: state.entities.player.attack + action.attack
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
    case 'INCREASE_LEVEL':
      return {
        ...state,
        level: state.level + 1
      };
    case 'RESET_LEVEL':
      return {
        ...state,
        level: 0
      };
    case 'SET_WINDOW_SIZE':
      return {
        ...state,
        windowHeight: action.windowHeight,
        windowWidth: action.windowWidth
      };
    case 'GAIN_XP':
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            toNextLevel: state.entities.player.toNextLevel - action.xp
          }
        }
      };
    case 'LEVEL_UP':
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            attack: state.entities.player.attack + action.attack,
            health: state.entities.player.health + action.health,
            toNextLevel: action.toNextLevel,
            level: state.entities.player.level + 1
          }
        }
      };
    case 'RESET_MAP':
      return {
        ...initialState,
        map: action.map
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
            entityType: 'enemy',
            health: action.health,
            attack: action.attack,
            x: action.location.x,
            y: action.location.y
          }
        }
      };
    case 'TOGGLE_DARKNESS':
      return {
        ...state,
        darkness: !state.darkness
      };
    default:
      return state;
  }
  return state;
}

// REDUX Store for game data
let store = Redux.createStore(gameReduxReducers);

// Game Component
const DragonSlayer = React.createClass({
  propTypes: {
    // This is the algorithm for creating the map.
    // Must be a function that ouputs a matrix of 0 (wall) and 1 (floor) tiles
    mapFunc: React.PropTypes.func.isRequired,
    getState: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return this._select(this.props.getState());
  },
  componentWillMount: function() {
    this._setupGame();
  },
  componentDidMount: function() {
    this._storeDataChanged();
    this.unsubscribe = store.subscribe(this._storeDataChanged);
    window.addEventListener('keydown', this._handleKeypress);
  },
  componentWillUnmount: function() {
    this.unsubscribe();
    window.removeEventListener('keydown', this._handleKeypress);
    window.removeEventListener('resize', setWindowSize);
  },
  _storeDataChanged: function() {
    const newState = this.props.getState()
    // Should player level up?
    if (newState.entities.player.toNextLevel <= 0) this._playerLeveledUp();
    this.setState(this._select(newState));
  },
  _select: function(state) {
    return {
      player: state.entities.player,
      entities: state.entities,
      map: state.map,
      filledTiles: state.filledTiles,
      level: state.level,
      windowHeight: state.windowHeight,
      windowWidth: state.windowWidth,
      darkness: state.darkness
    }
  },
  _playerLeveledUp: function() {
    const currLevel = this.state.player.level + 1;
    levelUp(currLevel * PLAYER.attack, currLevel * PLAYER.health,
              (currLevel + 1) * PLAYER.toNextLevel);
  },
  _setupGame: function() {
    resetMap(this.props.mapFunc());
    this._fillMap()
    this._storeDataChanged();
    setWindowSize();
  },
  _getEmptyCoords: function() {
    const {map, filledTiles} = this.props.getState();
    let coords, x, y;
    do {
      x = Math.floor(Math.random() * map.length);
      y = Math.floor(Math.random() * map[0].length);
      if (map[x][y] === tileType.FLOOR && !filledTiles[x + '-' + y]) {
        coords = {x: x, y: y};
      }
    } while (!coords);
    return coords;
  },
  _fillMap: function() {
    // Place player
    setLocation('player', this._getEmptyCoords());

    // Place items
    const state = this.props.getState();
    const weapon = weapons[state.level];
    addActor(weapon.entityName, 'weapon', weapon.health, weapon.attack, this._getEmptyCoords());

    // Place health and enemies
    const NUM_THINGS = 7,
          HEALTH_VAL = 20,
          LEVEL_MULTIPLIER = state.level + 1;

    for (let i = 0; i < NUM_THINGS; i++) {
      addActor('health'+i, 'health', HEALTH_VAL, 0, this._getEmptyCoords());
      addActor('enemy'+i, 'enemy', LEVEL_MULTIPLIER * ENEMY.health, LEVEL_MULTIPLIER * ENEMY.attack, this._getEmptyCoords());
    }
    // Place exit if not last level
    if (state.level < 4) addActor('exit', 'exit', 0, 0, this._getEmptyCoords());
    // Place boss on last (fifth) level
    if (state.level === 4) addBoss(125, 500, this._getEmptyCoords());
  },
  _addVector: function(coords, vector) {
    return {x: coords.x + vector.x, y: coords.y + vector.y};
  },
  _toggleDarkness: function() {
    toggleDarkness();
  },
  _handleKeypress: function(e) {
    let vector = '';
    switch (e.keyCode) {
      case 37:
        vector = {x: -1, y: 0};
        break;
      case 38:
        vector = {x: 0, y: -1};
        break;
      case 39:
        vector = {x: 1, y: 0};
        break;
      case 40:
        vector = {x: 0, y: 1};
        break;
      default:
        vector = '';
        break;
    }
    if (vector) {
      e.preventDefault();
      this._handleMove(vector);
    }
  },
  _handleMove: function(vector) {
    const state = this.props.getState();
    const player = state.entities.player;
    const map = state.map;
    const newCoords = this._addVector({x: player.x, y: player.y}, vector);
    if (newCoords.x > 0 && newCoords.y > 0 && newCoords.x < map.length &&
        newCoords.y < map[0].length &&
        map[newCoords.x][newCoords.y] !== tileType.WALL) {
      // Tile is not a wall, determine if it contains an entity
      const entityName = state.filledTiles[newCoords.x + '-' + newCoords.y];
      // move and return if empty
      if (!entityName) {
        move('player', vector);
        return;
      }
      // handle encounters with entities
      const entity = state.entities[entityName];
      switch (entity.entityType) {
        case 'weapon':
          switchWeapon(entityName, entity.attack);
          move('player', vector);
          break;
        case 'boss':
        case 'enemy':
          const playerAttack = Math.floor((Math.random() * DAMAGE_RANGE) + player.attack - DAMAGE_RANGE);
          const enemyAttack = Math.floor((Math.random() * DAMAGE_RANGE) + entity.attack - DAMAGE_RANGE);
          // Will hit kill enemy?
          if (entity.health > playerAttack) {
            // Will rebound hit kill player?
            if (enemyAttack > player.health) {
              showGameMessage("ERROR", "You have been killed. Try again.");
              this._setupGame();
              return;
            }
            inflictDamage(entityName,playerAttack);
            inflictDamage('player',enemyAttack);
          } else {
            // Is the enemy a boss?
            if (entityName === 'boss') {
              showGameMessage("SUCCESS", "You have defeated the dragon!");
              this._setupGame();
              return;
            }
            gainXp((state.level + 1) * ENEMY.xp);
            removeEntity(entityName);
          }
          break;
        case 'health':
          heal('player', entity.health);
          removeEntity(entityName);
          move('player', vector);
          break;
        case 'exit':
          resetBoard();
          setMap(this.props.mapFunc());
          setLocation('player', this._getEmptyCoords());
          increaseLevel();
          this._fillMap();
          break;
        default:
          break;
      }
    }
  },

  render: function() {
    const {map, entities, filledTiles, level, player, windowHeight,
           windowWidth, winner, darkness} = this.state, SIGHT = 7,
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
    if (endX > map.length) {
      startX = numCols > map.length ? 0 : startX - (endX - map.length);
      endX = map.length;
    }
    
    if (endY > map[0].length) {
      startY = numRows > map[0].length ? 0 : startY - (endY - map[0].length);
      endY = map[0].length;
    }

    // Create visible gameboard
    let rows = [], tileClass, glyphIcon, row;

    for (let y = startY; y < endY; y++) {
      row = [];
      for (let x = startX; x < endX; x++) {
        let entity = filledTiles[`${x}-${y}`];

        if (!entity) {
          tileClass = reverseLookup[map[x][y]];
          glyphIcon = "";
        } else {
          tileClass = entities[entity].entityType;
          glyphIcon = glyphIcons[tileClass];
        }
        if (darkness) {
          // check if it should be dark
          const xDiff = player.x - x,
                yDiff = player.y - y;

          if (Math.abs(xDiff) > SIGHT || Math.abs(yDiff) > SIGHT) {
            tileClass += ' dark';
          } else if (Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) >= SIGHT) {
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
          <div className="col-md-2 text-center">Health:</div>
          <div className="col-md-2 text-center">Current Weapon:</div>
          <div className="col-md-2 text-center">Attack Strength:</div>
          <div className="col-md-2 text-center">Level:</div>
          <div className="col-md-2 text-center">Current XP:</div>
          <div className="col-md-2 text-center">XP To Next Level:</div>            
        </div>
        <div className="gamestatus row">
          <div className="col-md-2 text-center">{player.health}</div>
          <div className="col-md-2 text-center">{player.weapon}</div>
          <div className="col-md-2 text-center">{player.attack}</div>
          <div className="col-md-2 text-center">400 XP</div>
          <div className="col-md-2 text-center">100</div>           
        </div>  

        <div className='buttons'>
          <ToggleVisibilityButton
            label='Toggle Darkness'
            id='toggleDarkness'
            handleClick={this._toggleDarkness} />
        </div>
        <div id='board'>
          {rows}
        </div>
      </div>
    );
  }
});

const ToggleVisibilityButton = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <button
        className="toggleButton"
        id={this.props.id}
        onClick={this.props.handleClick}>{this.props.label}
      </button>
    );
  }
});

ReactDOM.render(
  <DragonSlayer mapFunc={createMap} getState={store.getState}/>, document.getElementById("game-container")
);

// MAP GENERATOR
// Returns a matrix of the given dimensions with the number of rooms specified
// Uses ES6 Defaults to initialize any values that aren't passed in.
function createMap(width = 100, height = 100, maxRoomSize = 20, minRoomSize = 6, maxHallLength = 5, numRooms = 20, roomChance = .75) {
  // initialize a grid of walls

  // _fill is a lodash function that will fill elements of array with value from start up to, but not including, end.
  let map = _.fill(Array(width), 0);
  const blankCol = _.fill(Array(height), tileType.WALL);
  map = map.map(() => blankCol.slice());
  
  // create first room
  fillRect(map, {x: 45, y: 45}, {x: 10, y: 10}, tileType.FLOOR);
  
  // create rooms
  for (let i = 0; i < numRooms; i++) {
    placeRoom(map);
  }
  
  return map;
  
  // map is a grid, startCoord is an object like {x: 13, y: 15}
  // size is an object like {x: 5, y: 7}, fillVal is an int
  function fillRect(map, startCoord, size, fillVal) {
    for (let i = startCoord.x; i < startCoord.x + size.x; i++) {
      _.fill(map[i], fillVal, startCoord.y, size.y + startCoord.y);
    }
    return map;
  }
  
  // Will keep trying to place random rooms in random places until it succeeds.
  function placeRoom(map) {
    let wall, width, height, isRoom, startX, startY, coords, numClear;
    while (true) {
      // Create random location and room
      // TODO - Choose wall or hall
      numClear = 0;
      wall = findWall(map);
      coords = wall.coords;
      width = Math.floor((Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize);
      height = Math.floor((Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize);
      switch (wall.openDir) {
        case 'right':
          startX = coords.x - width;
          startY = (coords.y - Math.floor(height / 2)) + getDoorOffset(height);
          break;
        case 'left':
          startX = coords.x + 1;
          startY = (coords.y - Math.floor(height / 2)) + getDoorOffset(height);
          break;
        case 'top':
          startX = (coords.x - Math.floor(width / 2)) + getDoorOffset(width);
          startY = coords.y + 1;
          break;
        case 'bottom':
          startX = (coords.x - Math.floor(width / 2)) + getDoorOffset(width);
          startY = coords.y - height;
          break;
        default:
          break;
      }
      // Exit if room would be outside matrix
      if (startX < 0 || startY < 0 || startX + width >= map.length || startY + height >= map[0].length) {
        continue;
      }
      // check if all spaces are clear
      for (let i = startX; i < startX + width; i++) {
        if (map[i].slice(startY, startY + height).every(tile => tile === tileType.WALL)) {
          numClear++;
        }
      }
      if (numClear === width) {
        fillRect(map, {x: startX, y: startY}, {x: width, y: height}, tileType.FLOOR);
        map[coords.x][coords.y] = 1;
        return map;
      }
    }
    
    function getDoorOffset(length) {
      return Math.floor((Math.random() * length) - Math.floor((length - 1 ) / 2));
    }
  }
  
  // Loops until it finds a wall tile
  function findWall(map) {
    const coords = {x: 0, y: 0};
    let wallDir = false;
    do {
      coords.x = Math.floor(Math.random() * map.length);
      coords.y = Math.floor(Math.random() * map[0].length);
      wallDir = isWall(map, coords);
    } while (!wallDir);
    
    return {coords: coords, openDir: wallDir};
  }
  
  // Takes a map matrix and a coordinate object
  // Returns false if not a wall, otherwise the direction of the open tile
  function isWall(map, coords) {
    // return false if tile isn't wall
    if (map[coords.x][coords.y] !== tileType.WALL) { return false; }
    // left is open
    if (typeof map[coords.x - 1] !== 'undefined' && map[coords.x - 1][coords.y] === tileType.FLOOR) {
      return 'left';
    }
    // right is open
    if (typeof map[coords.x + 1] !== 'undefined' && map[coords.x + 1][coords.y] === tileType.FLOOR) {
      return 'right';
    }
    // top is open
    if (map[coords.x][coords.y - 1] === tileType.FLOOR) {
      return 'top';
    }
    // bottom is open
    if (map[coords.x][coords.y + 1] === tileType.FLOOR) {
      return 'bottom';
    }
    
    return false;
  }
}
