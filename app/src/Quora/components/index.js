import React, {Component} from "react";
import {Route, Switch,IndexRoute} from "react-router-dom";
import QuestionIndexContainer from './question_index/question_index_container';
import QuestionShowContainer from './question_show/question_show_container';
import TopicShowContainer from './topic_show/topic_show_container';
import AnswerEditor from './question_show/answerEditor';

class Index extends Component {

  render() {
    return (
      <Switch>
        <Route path="/qa/answer" component={AnswerEditor}/>
        <Route path="/qa/:id" component={QuestionShowContainer} />
        <Route path="/topic/:id" component={TopicShowContainer} />
        <Route path="/qa" exact component={QuestionIndexContainer} />
      </Switch>
    );
  }
}
export default Index;
