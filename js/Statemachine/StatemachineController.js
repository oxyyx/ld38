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

      // Create states
      var menuState = new MenuState();
      states.push(menuState);
      var gameState = new GameState();
      states.push(gameState);

      // Define state transitions
      var stateTransitions = [
        {targetState: menuState},
        {sourceState: menuState, event: 'startGame', targetState: gameState},
        {sourceState: gameState, event: 'pause', targetState: menuState}
      ];

      var initialState = null;
      for(i = 0; i < stateTransitions.length; ++i){
        var transition = stateTransitions[i];
        if(transition.hasOwnProperty('event') && transition.hasOwnProperty('sourceState')){
          transition.sourceState[transition.event] = getStateTransition(transition.sourceState, transition.targetState);
        }
        else{
          initialState = transition.targetState;
        }
      }

      initialState.activate();
    };

    StatemachineController.updateActiveState = function(){
      if(updateStateEvent){
        updateStateEvent();
      }
    };
  }(PJB.statemachineController = PJB.statemachineController || {}));
}(window.PJB = window.PJB || {}));
