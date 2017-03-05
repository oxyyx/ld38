(function(PJB){
  (function(StatemachineController){
    var states = [];
    var stateTransitions = [];
    var updateStateEvent;

    StatemachineController.initialize = function(){
      function getStateTransition(currentState, targetState){
        return function stateTransitioning(){
          updateStateEvent = null;
          if(currentState){
            currentState.deactivate();
          }

          targetState.activate();
          updateStateEvent = targetState.update;
        };
      }

      var menuState = new MenuState();
      states.push(menuState);
      var gamestate = new State();
      states.push(gameState);

      var stateTransitions = [
        {"initialState": menuState},
        {"startGame": gameState},
        {"pause": menuState}
      ];

      for(i = 0; i < states.length; ++i){
        var state = states[i];
        state.activate();
        state.deactivate();
        state.update();

        for(transitionIndex = 1; transitionIndex < stateTransitions.length; ++i){   // transitionIndex starts at 1, because index 0 contains (or SHOULD contain) the INITIAL STATE (not an actual transition between states, but the transition from 'no state' to 'first state').
          state./*stateTransitions[transitionIndex].key*/ = getStateTransition(state, stateTransitions[transitionIndex]./*value*/);
        }
      }
    };

    StatemachineController.updateActiveState = function(){
      if(updateStateEvent){
        updateStateEvent();
      }
    };
  }(PJB.statemachineController = PJB.statemachineController || {}));
}(window.PJB = window.PJB || {}));
