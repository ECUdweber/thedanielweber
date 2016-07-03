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
    attack: 5
  },
  {
    entityName: 'Hammer',
    entityType: 'weapon',
    health: 0,
    attack: 10
  },
  {
    entityName: 'Hanzo Sword',
    entityType: 'weapon',
    health: 0,
    attack: 15
  },
  {
    entityName: 'Blades of Chaos',
    entityType: 'weapon',
    health: 0,
    attack: 20
  },
  {
    entityName: 'Dragon Spear',
    entityType: 'weapon',
    health: 0,
    attack: 30
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
function dealDamage(entity, value) {
  store.dispatch({type: 'DEAL_DAMAGE', entityName: entity, value: value});
}
function addHealth(entity, health) {
  store.dispatch({type: 'ADD_HEALTH', entityName: entity, value: health});
}
function moveEntity(entity, vector) {
  store.dispatch({type: 'MOVE_ENTITY', entityName: entity, vector: vector});
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
    boardWidth: window.innerWidth,
    boardHeight: window.innerHeight
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

// Initial State of our game to use with REDUX
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
  filledTiles: {'0-0': 'player'},
  wallsOrTilesStore: [],
  boardLevel: 1,
  boardHeight: 500,
  boardWidth: 500,
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

    case 'DEAL_DAMAGE':
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
            attack: state.entities.player.attack + action.attack
          }
        }
      };
    case 'MOVE_ENTITY':
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
        boardHeight: action.boardHeight,
        boardWidth: action.boardWidth
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
    gameBoardGenerator: React.PropTypes.func.isRequired
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
      boardLevel: state.boardLevel, userInDark: state.userInDark, boardHeight: state.boardHeight, boardWidth: state.boardWidth      
    }
  },
  playerLeveledUp: function() {
    const currLevel = this.state.player.playerLevel + 1;
    levelUpPlayer(currLevel * MULTIPLIERS.PLAYER.attack, currLevel * MULTIPLIERS.PLAYER.health, (currLevel + 1) * MULTIPLIERS.PLAYER.toNextLevel);
  },
  generateBoard: function() {
    resetMap(this.props.gameBoardGenerator());
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

      // move and return if this space is empty
      if (!entityName) {
        moveEntity('player', moves);
        return;
      }

      // this new space is not empty. Handle run in with entity in this space
      // what is it we are running into?
      const entity = state.entities[entityName];
      switch (entity.entityType) {
        case 'weapon':
          switchWeapon(entityName, entity.attack);
          showGameMessage("SUCCESS", "NEW WEAPON UNLOCKED: " + entityName, 2000);
          moveEntity('player', moves);
          break;
        case 'boss':
        case 'enemy':
          const playerAttack = Math.floor((Math.random() * DAMAGE_RANGE) + player.attack - DAMAGE_RANGE);
          const enemyAttack = Math.floor((Math.random() * DAMAGE_RANGE) + entity.attack - DAMAGE_RANGE);
          // Dpes this hit kill the enemy?
          if (entity.health > playerAttack) {
            // Does enemies hit kill player?
            if (enemyAttack > player.health) {
              showGameMessage("ERROR", "You have been killed. Try again.", 5000);
              // Player lost. Restart the game.
              this.generateBoard();
              return;
            }
            dealDamage(entityName, playerAttack);
            dealDamage('player',enemyAttack);

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
          moveEntity('player', moves);
          break;
        case 'exit':
          resetBoard();
          setMap(this.props.gameBoardGenerator());
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
    const {wallsOrTilesStore, entities, filledTiles, boardLevel, player, boardHeight, boardWidth, winner, userInDark} = this.state;
    const VISIBILTY = 10, tileSize = 11;
    
    // Calculate how many rows and columns we can utilize from the state of our game
    const numCols = Math.floor((boardWidth / tileSize)), 
      numRows = Math.floor((boardHeight/ tileSize) - 5);

    // Just need to show a portion of the board. so get the visible portion surrounding the player
    let leftSideOfVisibleBoard = Math.floor(player.x - (numCols/2));
    let topOfVisibleBoard = Math.floor(player.y - (numRows/2));

    // Would this try to place at less than 0?
    if (leftSideOfVisibleBoard < 0) leftSideOfVisibleBoard = 0;
    if (topOfVisibleBoard < 0) topOfVisibleBoard = 0;

    // Set end coords
    let endX = leftSideOfVisibleBoard + numCols;
    let endY = topOfVisibleBoard + numRows;

    // Final validation of start and end coords
    if (endX > wallsOrTilesStore.length) {
      leftSideOfVisibleBoard = numCols > wallsOrTilesStore.length ? 0 : leftSideOfVisibleBoard - (endX - wallsOrTilesStore.length);
      endX = wallsOrTilesStore.length;
    }
    
    if (endY > wallsOrTilesStore[0].length) {
      topOfVisibleBoard = numRows > wallsOrTilesStore[0].length ? 0 : topOfVisibleBoard - (endY - wallsOrTilesStore[0].length);
      endY = wallsOrTilesStore[0].length;
    }

    // Create visible gameboard
    let rows = [], classesForCell, glyphIcon, row, xCellsFromPlayer, yCellsFromPlayer;

    for (let y = topOfVisibleBoard; y < endY; y++) {
      row = [];
      for (let x = leftSideOfVisibleBoard; x < endX; x++) {
        let entityAtLocation = filledTiles[x + '-' + y];
        //let entityAtLocation = filledTiles[`${x}-${y}`];

        if (!entityAtLocation) {
          classesForCell = tileTypeKey[wallsOrTilesStore[x][y]];
          glyphIcon = "";
        } else {
          classesForCell = entities[entityAtLocation].entityType;
          glyphIcon = glyphIcons[classesForCell];
        }
        if (userInDark) {
          // Visibility is currently set to darkness, so check if this row is out of visibility randge and would be dark
          xCellsFromPlayer = player.x - x;
          yCellsFromPlayer = player.y - y;
          if((xCellsFromPlayer * -1) > VISIBILTY || (yCellsFromPlayer * -1) > VISIBILTY || 
            (Math.sqrt(Math.pow(xCellsFromPlayer, 2) + Math.pow(yCellsFromPlayer, 2)) >= VISIBILTY)) 
            classesForCell += ' dark';
        }
        row.push(<GameCell cellClass={'glyphicon tile ' + classesForCell + ' ' + glyphIcon} key={x + '-' + y} />);
      }
      rows.push(React.createElement('div', {className: 'boardRow', key: 'row' + y}, row))
    } 

    return (
      <div id="game">
        <div className="gamestatus-header row">
          <div className="col-md-1 text-center">Health:<br/>{player.health}</div>
          <div className="col-md-2 text-center">Current Weapon:<br/>{player.weapon}</div>
          <div className="col-md-2 text-center">Attack Strength:<br/>{player.attack}</div>
          <div className="col-md-1 text-center">Board:<br/>{boardLevel}</div>
          <div className="col-md-2 text-center">Player Level:<br/>{player.playerLevel}</div>
          <div className="col-md-1 text-center">XP:<br/>{player.xp}</div>
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

const GameCell = React.createClass({
  render: function() {
    return (
      <cell className={this.props.cellClass}>&nbsp;</cell>
    )
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
  <DragonSlayer gameBoardGenerator={createGameBoardArray} getState={store.getState}/>, document.getElementById("game-container")
);

// function that handles messages to our user.
function showGameMessage(status, message, duration) {
  humane.log(message, { timeout: duration, addnCls: 'humane-message-' + status });
}

// This function will create an array which will act as a store representing each cell on the map. It will either have a 0 for wall, or 1 for free space
// Use ES6 Defaults to initialize any values that aren't passed in.
function createGameBoardArray(w=100, h=100, maxSizeForRoom=20, minSizeForRoom=6, numberOfRoomsNeeded=20) {
  // Create an array of all wall tiles to start. It will consist of an array of arrays that has h rows and each row has w columns
  let wallsOrTilesStore = [];

  // Create an array of arrays that has w items in each array or columns (width of board given) and h arrays or rows (height of board given)
  for(let rows = 0; rows < h; rows++) {
    let columns = [];
    for(let cols = 0; cols < w; cols++) {
      // Push cell of type w (0) onto array for a column
      columns.push(tileType.w);
    }
    wallsOrTilesStore.push(columns);
  }

  //console.log("wallsOrTilesStore: ", wallsOrTilesStore);
  
  let startingPoint = {x: 30, y: 30}, firstRoomDimensions = {x: 15, y: 15};

  // create an initial room so the others can build off this. 
  //   pass in the game board, starting coords of this room, the room size, and the type of these which is floor
  createRoomAtLocation(wallsOrTilesStore, startingPoint, firstRoomDimensions);

  // create the other rooms desired
  for (let roomsCount = 0; roomsCount < numberOfRoomsNeeded; roomsCount++) {
    placeRoom(wallsOrTilesStore, maxSizeForRoom, minSizeForRoom);
  }
  return wallsOrTilesStore;  
}

// This function create a room in board matrix. The room starts at startingCoords and will be the dimensions passed in
function createRoomAtLocation(wallsOrTilesStore, startingCoords, dimensions) {
  // start at the the x location of the startingCoords passed in. The room will be dimensions.x wide
  // For each row, we are going to go down dimensions.y and fill with tile type of floor

  // Start at location x in array of arrays. So start at COLUMN X and go up to COLUMN desired width
  for (let xLoc = startingCoords.x; xLoc < startingCoords.x + dimensions.x; xLoc++) {
    for (let yLoc = startingCoords.y; yLoc < startingCoords.y + dimensions.y; yLoc++) {
      wallsOrTilesStore[xLoc][yLoc] = tileType.f;
    }
  }
  return wallsOrTilesStore;
}

function printMatrix(matrix) {
  for (let row = 0; row < matrix.length; row++) {
    console.log(matrix[row]);
  }
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

function getDoorOffset(length) {
  return Math.floor((Math.random() * length) - Math.floor((length - 1 ) / 2));
}

// Will keep trying to place random rooms in random places until it succeeds.
function placeRoom(wallsOrTilesStore, maxSizeForRoom, minSizeForRoom) {
  let wall, w, h, isRoom, startX, startY, coords, numClear;
  while (true) {
    // Create random location and room
    // TODO - Choose wall or hall
    numClear = 0;
    wall = getCompassHeadingNextWall(wallsOrTilesStore);
    coords = wall.coords;
    w = Math.floor((Math.random() * (maxSizeForRoom - minSizeForRoom)) + minSizeForRoom);
    h = Math.floor((Math.random() * (maxSizeForRoom - minSizeForRoom)) + minSizeForRoom);
    switch (wall.openDir) {
      case 'E':
        startX = coords.x - w;
        startY = (coords.y - Math.floor(h / 2)) + getDoorOffset(h);
        break;
      case 'W':
        startX = coords.x + 1;
        startY = (coords.y - Math.floor(h / 2)) + getDoorOffset(h);
        break;
      case 'N':
        startX = (coords.x - Math.floor(w / 2)) + getDoorOffset(w);
        startY = coords.y + 1;
        break;
      case 'S':
        startX = (coords.x - Math.floor(w / 2)) + getDoorOffset(w);
        startY = coords.y - h;
        break;
      default:
        break;
    }
    // Exit if room would be outside matrix
    if (startX < 0 || startY < 0 || startX + w >= wallsOrTilesStore.length || startY + h >= wallsOrTilesStore[0].length) {
      continue;
    }
    // check if all spaces are clear
    for (let i = startX; i < startX + w; i++) {
      if (wallsOrTilesStore[i].slice(startY, startY + h).every(tile => tile === tileType.w)) {
        numClear++;
      }
    }
    if (numClear === w) {
      createRoomAtLocation(wallsOrTilesStore, {x: startX, y: startY}, {x: w, y: h});
      wallsOrTilesStore[coords.x][coords.y] = 1;
      return wallsOrTilesStore;
    }
  }
}
