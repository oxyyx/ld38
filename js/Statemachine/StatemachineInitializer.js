(function(PJB){
  (function(StatemachineInitializer){
    var updateStateEvent;

    StatemachineInitializer.initialize = function(states, stateTransitions){
      function getRegularStateTransition(currentState, targetState){
        return function stateTransitioning(){
          updateStateEvent = null;
          if(currentState){
            currentState.deactivate();
          }

          targetState.activate();
          updateStateEvent = targetState.update;
        };
      };

      function getToOverlayStateTransition(currentState, targetState){
        return function stateTransitioning(){
          if(currentState){
            currentState.deactivate();
          }

          targetState.dismissEventHandler = getRegularStateTransition(targetState, currentState);

          targetState.activate();
          updateStateEvent = targetState.update;
        };
      };

      var initialState = null;
      for(i = 0; i < stateTransitions.length; ++i){
        var transition = stateTransitions[i];
        if(transition.hasOwnProperty('event') && transition.hasOwnProperty('sourceState')){
          if(transition.targetState instanceof OverlayState){
            transition.sourceState[transition.event] = getToOverlayStateTransition(transition.sourceState, transition.targetState);
          }
          else{
            transition.sourceState[transition.event] = getRegularStateTransition(transition.sourceState, transition.targetState);
          }
        }
        else{
          initialState = transition.targetState;
        }
      }

      initialState.activate();

      initialState.showPopup();
    };

    StatemachineInitializer.updateActiveState = function(){
      if(updateStateEvent){
        updateStateEvent();
      }
    };
  }(PJB.statemachineInitializer = PJB.statemachineInitializer || {}));
}(window.PJB = window.PJB || {}));
