/**
 * @file
 * Attaching React component via Drupal behaviors..
 */
/****
(($, Drupal) => {
  'use strict';

  Drupal.behaviors.TooitQuiz = {
    attach: function (context, settings) {
      if($(context).find('.tooit-quiz').length) {
        var Items = [];
        $(context).find('.tooit-quiz').once('tooit-quiz').each(function () {
          ReactDOM.render(
            <App qid={$(this).attr('data-quiz')} />,
            document.getElementById(this.id)
          );

        });
      }
    }
  };

})(jQuery, Drupal);

****/


(($, Drupal) => {
  'use strict';

  $(document).ready(function() {
    if($('.tooit-quiz').length) {
      var Items = [];
      $('.tooit-quiz').once('tooit-quiz').each(function () {
        ReactDOM.render(
          <App qid={$(this).attr('data-quiz')} />,
          document.getElementById(this.id)
        );
     });
    }
  });
})(jQuery, Drupal);

//react component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      item: []
    };
  }

  componentDidMount() {
    var baseUrl = drupalSettings.path.baseUrl + drupalSettings.tooit_quiz_block.quiz_url;

    fetch(baseUrl + '?quiz=' + this.props.qid + '&_format_json')
      .then(Response => Response.json())
      .then(res => {
        this.setState({
          item: res,
        });
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div>
        <BuildForm qid={this.props.qid} item={this.state.item}/>
      </div>
    );
  }
}

class BuildForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      step: 0,
      error: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleValidate() {
    //value is required
    if (this.state.data[this.state.step - 1] == undefined) {
      this.setState(state => ({
        step: state.step - 1,
        error: true
      }));
      return false;
    }

    if (this.props.item.questions[this.state.step - 1] != undefined) {
      var count = 0;
      var total = 0;
      var question = this.props.item.questions[this.state.step - 1];

      //total number of correct answers
      for (let i=0; i<question.answers.length; i++) {
        if (question.answers[i].isCorrect === true) {
          count = count + 1;
        }
      }

      //validate correct answers
      for (let i=0; i<question.answers.length; i++) {
        if (this.state.data[this.state.step - 1][i] != undefined) {
          if (question.answers[i].isCorrect === true) {
            total = total + 1;
          }

          if (question.answers[i].isCorrect === false && this.state.data[this.state.step - 1][i] === true
            || question.answers[i].isCorrect === true && this.state.data[this.state.step - 1][i] === false) {
            this.setState(state => ({
              step: state.step - 1,
              error: true
            }));
            return false;
          }
        }
      }

      if (total != count) { //validate total number of selections
        this.setState(state => ({
          step: state.step - 1,
          error: true
        }));
        return false;
      }
    }
  }

  toggle(e) {
    var item = this.state.data;
    if (item[this.state.step] == undefined) {
      item[this.state.step] = {};
    }

    item[this.state.step][e.target.id] = e.target.checked;
    this.setState(state => ({
      step: state.step,
      data : item,
      error: false
    }));
  }

  previousStep(e) {
    e.preventDefault();
    var data = this.state.data;

    this.setState(state => ({
      step: state.step - 1,
      data: data,
      error: false
    }));
  }

  nextStep(e) {
    e.preventDefault();
    var data = this.state.data;

    this.setState(state => ({
      step: state.step + 1,
      data: data,
    }), () => {
      this.handleValidate();
    });
  }

  render() {
    var answers = {};

    if (this.props.item.questions != undefined && this.props.item.questions[this.state.step]!= undefined) {
      answers = this.props.item.questions[this.state.step].answers.map((value, i) => {
        let data = false;
        if (this.state.data[this.state.step]) {
          data = this.state.data[this.state.step][i];
        }

        return (
          <div className="form-check" key={i}>
            <input className="form-check-input" id={i} checked={data === true ? 1 : 0} type="checkbox" onChange={this.toggle}/>
            <label className='col-md-6 form-check-label'> {value.title}</label>
          </div>
        );
      });
    }

    return (          
      <div className="container">
        {this.props.item.questions != undefined && this.props.item.questions[this.state.step]!= undefined ? 
          <div className="border-bottom border-success">
            <h3 className="text-uppercase text-center font-weight-bold">{this.props.item.title}</h3>
            <StepWizard questions={this.props.item.questions} step={this.state.step}/>
 
            <form onSubmit = {this.handleSubmit}>
              <div className="pt-3"><h4>{this.props.item.questions[this.state.step].text}</h4></div>

              {this.state.error == true ? (
                <div className="alert alert-danger col-md-8"> try again</div>
              ) : ''}
              <div>{answers}</div>

              <div className="actions submit-form pb-5">
                {this.state.step > 0 ? (
                  <div>
                    <button className="btn btn-warning mr-5 float-left" onClick={this.previousStep.bind(this)} type="submit"> Back </button>
                    <button className="btn btn-success float-right" type="submit" onClick={this.nextStep.bind(this)} id={this.props.qid}> Next </button>
                  </div>
                ): (
                  <button className="btn btn-success float-right" type="submit" onClick={this.nextStep.bind(this)} id={this.props.qid}> Next </button>
                )}
               </div>
            </form>
          </div>
        : (
          <div className="p-3">
            <div className="pt-3"><h3 className="text-uppercase text-center font-weight-bold">{this.props.item.title}</h3></div>
            <div className="bg-light text-uppercase text-success p-3 text-center font-weight-bold">Congratulations!!!</div>
          </div>
        )}
      </div>
    );
  }
}

class StepWizard extends React.Component {
  render() {
    var questions = this.props.questions;
    return (
      <ul className="nav nav-tabs">
        {questions.map((item, i) => (
          <li className="mx-auto nav-item col-md-2 text-center text-info bg-light pt-2" key={i}>
            <a className={i === this.props.step ? "nav-link active text-success" : "nav-link"} href="#">
              Step #{i}
            </a>
          </li>
        )) }
        <li className="mx-auto nav-item col-md-2 text-center text-info bg-light pt-2">
          <a className={questions.length + 1 === this.props.step ? "nav-link active text-success" : "nav-link"} href="#">
            Step #{questions.length + 1}
          </a>
        </li>
      </ul>
    );
  }
}
