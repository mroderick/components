var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { React, Component } from '../imports';
import { WSDropdownMenu } from './ws-dropdown-menu';

export var WSDropdownItem = function (_Component) {
  _inherits(WSDropdownItem, _Component);

  function WSDropdownItem(props, context) {
    _classCallCheck(this, WSDropdownItem);

    var _this = _possibleConstructorReturn(this, (WSDropdownItem.__proto__ || Object.getPrototypeOf(WSDropdownItem)).call(this, props, context));

    Object.defineProperty(_this, 'handlePropagation', {
      enumerable: true,
      writable: true,
      value: function value(type, data) {
        _this.props.handle(type, data);
      }
    });

    _this.state = props.item;
    _this.menu = null;
    return _this;
  }

  _createClass(WSDropdownItem, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.state = props.item;
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      event.stopPropagation();

      if (this.props.isParent) {
        this.props.handle('go-back');
      } else if (this.state.children && this.state.children.length) {
        this.props.handle('show-child', this.menu);
      } else {
        if (!this.context.multiple) {
          this.state.selected = true;
          this.props.handle('change', this.state);
        } else {
          this.state.selected = !this.state.selected;
        }

        this.setState(this.state);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var anchorClass = 'text';
      anchorClass += this.state.selected ? ' is-active' : '';
      anchorClass += this.state.focused ? ' is-focused' : '';
      anchorClass += this.state.disabled ? ' is-disabled' : '';

      return React.createElement(
        'li',
        { className: 'dropdown-item', onClick: function onClick(event) {
            return _this2.onClick(event);
          } },
        React.createElement(
          'a',
          { className: anchorClass, href: this.state.href },
          (this.props.icon || this.state.icon) && React.createElement('i', { className: 'icon ' + (this.props.icon || this.state.icon) }),
          this.state.label
        ),
        !this.props.isParent && this.state.children && React.createElement(WSDropdownMenu, {
          items: this.state.children,
          parent: this.state,
          ref: function ref(element) {
            _this2.menu = element;
          },
          handle: this.handlePropagation
        })
      );
    }
  }]);

  return WSDropdownItem;
}(Component);
Object.defineProperty(WSDropdownItem, 'defaultProps', {
  enumerable: true,
  writable: true,
  value: {
    item: null,
    icon: null,
    isParent: false,
    handle: function handle() {}
  }
});
Object.defineProperty(WSDropdownItem, 'propTypes', {
  enumerable: true,
  writable: true,
  value: {
    item: React.PropTypes.object,
    icon: React.PropTypes.string,
    isParent: React.PropTypes.bool,
    handle: React.PropTypes.func
  }
});
Object.defineProperty(WSDropdownItem, 'contextTypes', {
  enumerable: true,
  writable: true,
  value: {
    multiple: React.PropTypes.bool
  }
});