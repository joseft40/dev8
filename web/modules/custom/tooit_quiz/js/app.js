/**
 * @file
 * Attaching React component via Drupal behaviors..
 */
(($, Drupal) => {
  'use strict';

  Drupal.behaviors.TooitQuiz = {
    attach: function (context, settings) {

      // Render our component.
      if($(context).find('.tooit-quiz').length) {
        var Items = [];
        $(context).find('.tooit-quiz').once('tooit-quiz').each(function () {
          ReactDOM.render(React.createElement(App, {
            qid: $(this).attr('data-quiz')
          }), document.getElementById(this.id));
        });
      }
    }
  };

})(jQuery, Drupal);

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//react component
var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.state = {
      error: null,
      isLoaded: false,
      item: []
    };
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var baseUrl = drupalSettings.path.baseUrl + drupalSettings.tooit_quiz_block.quiz_url;
      fetch(baseUrl + '?quiz=' + this.props.qid + '&_format_json').then(function (Response) {
        return Response.json();
      }).then(function (res) {
        _this2.setState({
          item: res
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement(BuildForm, {
        qid: this.props.qid,
        item: this.state.item
      }));
    }
  }]);

  return App;
}(React.Component);

var BuildForm =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(BuildForm, _React$Component2);

  function BuildForm(props) {
    var _this3;

    _classCallCheck(this, BuildForm);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(BuildForm).call(this, props));
    _this3.state = {
      data: {},
      step: 0,
      error: false
    };
    _this3.handleSubmit = _this3.handleSubmit.bind(_assertThisInitialized(_this3));
    _this3.toggle = _this3.toggle.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(BuildForm, [{
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
    }
  }, {
    key: "handleValidate",
    value: function handleValidate() {
      //value is required
      if (this.state.data[this.state.step - 1] == undefined) {
        this.setState(function (state) {
          return {
            step: state.step - 1,
            error: true
          };
        });
        return false;
      }

      if (this.props.item.questions[this.state.step - 1] != undefined) {
        var count = 0;
        var total = 0;
        var question = this.props.item.questions[this.state.step - 1]; //total number of correct answers

        for (var i = 0; i < question.answers.length; i++) {
          if (question.answers[i].isCorrect === true) {
            count = count + 1;
          }
        } //validate correct answers


        for (var _i = 0; _i < question.answers.length; _i++) {
          if (this.state.data[this.state.step - 1][_i] != undefined) {
            if (question.answers[_i].isCorrect === true) {
              total = total + 1;
            }

            if (question.answers[_i].isCorrect === false && this.state.data[this.state.step - 1][_i] === true || question.answers[_i].isCorrect === true && this.state.data[this.state.step - 1][_i] === false) {
              this.setState(function (state) {
                return {
                  step: state.step - 1,
                  error: true
                };
              });
              return false;
            }
          }
        }

        if (total != count) {
          //validate total number of selections
          this.setState(function (state) {
            return {
              step: state.step - 1,
              error: true
            };
          });
          return false;
        }
      }
    }
  }, {
    key: "toggle",
    value: function toggle(e) {
      var item = this.state.data;

      if (item[this.state.step] == undefined) {
        item[this.state.step] = {};
      }

      item[this.state.step][e.target.id] = e.target.checked;
      this.setState(function (state) {
        return {
          step: state.step,
          data: item,
          error: false
        };
      });
    }
  }, {
    key: "previousStep",
    value: function previousStep(e) {
      e.preventDefault();
      var data = this.state.data;
      this.setState(function (state) {
        return {
          step: state.step - 1,
          data: data,
          error: false
        };
      });
    }
  }, {
    key: "nextStep",
    value: function nextStep(e) {
      var _this4 = this;

      e.preventDefault();
      var data = this.state.data;
      this.setState(function (state) {
        return {
          step: state.step + 1,
          data: data
        };
      }, function () {
        _this4.handleValidate();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var answers = {};

      if (this.props.item.questions != undefined && this.props.item.questions[this.state.step] != undefined) {
        answers = this.props.item.questions[this.state.step].answers.map(function (value, i) {
          var data = false;

          if (_this5.state.data[_this5.state.step]) {
            data = _this5.state.data[_this5.state.step][i];
          }

          return React.createElement("div", {
            className: "form-check",
            key: i
          }, React.createElement("input", {
            className: "form-check-input",
            id: i,
            checked: data === true ? 1 : 0,
            type: "checkbox",
            onChange: _this5.toggle
          }), React.createElement("label", {
            className: "col-md-6 form-check-label"
          }, " ", value.title));
        });
      }

      return React.createElement("div", {
        className: "container"
      }, this.props.item.questions != undefined && this.props.item.questions[this.state.step] != undefined ? React.createElement("div", {
        className: "border-bottom border-success"
      }, React.createElement("h3", {
        className: "text-uppercase text-center font-weight-bold"
      }, this.props.item.title), React.createElement(StepWizard, {
        questions: this.props.item.questions,
        step: this.state.step
      }), React.createElement("form", {
        onSubmit: this.handleSubmit
      }, React.createElement("div", {
        className: "pt-3"
      }, React.createElement("h4", null, this.props.item.questions[this.state.step].text)), this.state.error == true ? React.createElement("div", {
        className: "alert alert-danger col-md-8"
      }, " try again") : '', React.createElement("div", null, answers), React.createElement("div", {
        className: "actions submit-form pb-5"
      }, this.state.step > 0 ? React.createElement("div", null, React.createElement("button", {
        className: "btn btn-warning mr-5 float-left",
        onClick: this.previousStep.bind(this),
        type: "submit"
      }, " Back "), React.createElement("button", {
        className: "btn btn-success float-right",
        type: "submit",
        onClick: this.nextStep.bind(this),
        id: this.props.qid
      }, " Next ")) : React.createElement("button", {
        className: "btn btn-success float-right",
        type: "submit",
        onClick: this.nextStep.bind(this),
        id: this.props.qid
      }, " Next ")))) : React.createElement("div", {
        className: "p-3"
      }, React.createElement("div", {
        className: "pt-3"
      }, React.createElement("h3", {
        className: "text-uppercase text-center font-weight-bold"
      }, this.props.item.title)), React.createElement("div", {
        className: "bg-light text-uppercase text-success p-3 text-center font-weight-bold"
      }, "Congratulations!!!")));
    }
  }]);

  return BuildForm;
}(React.Component);

var StepWizard =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(StepWizard, _React$Component3);

  function StepWizard() {
    _classCallCheck(this, StepWizard);

    return _possibleConstructorReturn(this, _getPrototypeOf(StepWizard).apply(this, arguments));
  }

  _createClass(StepWizard, [{
    key: "render",
    value: function render() {
      var _this6 = this;

      var questions = this.props.questions;
      return React.createElement("ul", {
        className: "nav nav-tabs"
      }, questions.map(function (item, i) {
        return React.createElement("li", {
          className: "mx-auto nav-item col-md-2 text-center text-info bg-light pt-2",
          key: i
        }, React.createElement("a", {
          className: i === _this6.props.step ? "nav-link active text-success" : "nav-link",
          href: "#"
        }, "Step #", i));
      }), React.createElement("li", {
        className: "mx-auto nav-item col-md-2 text-center text-info bg-light pt-2"
      }, React.createElement("a", {
        className: questions.length + 1 === this.props.step ? "nav-link active text-success" : "nav-link",
        href: "#"
      }, "Step #", questions.length + 1)));
    }
  }]);

  return StepWizard;
}(React.Component);
