var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { React, Component, PropTypes } from '../imports';
import { CookieStorage } from './storage/cookie-storage';
import { LocalStorage } from './storage/local-storage';
import { Authorization } from './authorization';
import { WSDropdown } from '../ws-dropdown/ws-dropdown';

export var WSHeader = function (_Component) {
  _inherits(WSHeader, _Component);

  _createClass(WSHeader, null, [{
    key: 'setStorageType',
    value: function setStorageType(type, name) {
      if (type === 'cookie') {
        this.storage = new CookieStorage(name);
      } else {
        this.storage = new LocalStorage(name);
      }
    }
  }, {
    key: 'getAccessToken',
    value: function getAccessToken() {
      var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : location.hash.substr(1);

      this.authorization = this.authorization || new Authorization(this.storage);
      if (!this.authorization.accessToken) {
        this.authorization.tryFetchToken(queryString);
      }
      return this.authorization.accessToken;
    }
  }, {
    key: 'removeAccessToken',
    value: function removeAccessToken() {
      this.authorization = this.authorization || new Authorization(this.storage);
      this.authorization.unauthorize();
    }
  }, {
    key: 'getUserAbbreviation',
    value: function getUserAbbreviation() {
      try {
        var token = this.getAccessToken();
        var parts = token.split('.');
        var json = JSON.parse(atob(parts[1]));

        var nameKey = Object.keys(json).find(function (key) {
          return key.includes('managed-id');
        });
        return json[nameKey];
      } catch (e) {
        return null;
      }
    }
  }, {
    key: 'getLocale',
    value: function getLocale() {
      var locale = WSHeader.storage.get('locale') || window.navigator.language.replace(/([a-z]+)-.*/, '$1');
      if (['de', 'en'].indexOf(locale) === -1) {
        return 'en';
      }
      return locale;
    }
  }]);

  function WSHeader(props) {
    _classCallCheck(this, WSHeader);

    var _this = _possibleConstructorReturn(this, (WSHeader.__proto__ || Object.getPrototypeOf(WSHeader)).call(this, props));

    _this.initState();
    _this.initAuthorization(props);
    _this.mounted = false;
    _this.locales = [{ label: 'German', value: 'de' }, { label: 'English', value: 'en' }];
    _this.subMenus = [];
    _this.menuItems = [];
    _this.level2 = null;
    return _this;
  }

  _createClass(WSHeader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mounted = true;
    }
  }, {
    key: 'setLocale',
    value: function setLocale(newLocale) {
      this.setState({ locale: newLocale });
      WSHeader.storage.set('locale', newLocale);
      this.dispatchEvent('ws-locale-changed', newLocale);

      if (typeof this.props.onLocaleChange === 'function') {
        this.props.onLocaleChange(newLocale);
      }
    }
  }, {
    key: 'initState',
    value: function initState() {
      this.state = {
        isLoggedIn: !!(this.constructor.authorization && this.constructor.authorization.accessToken),
        locale: WSHeader.getLocale()
      };
    }
  }, {
    key: 'initAuthorization',
    value: function initAuthorization() {
      var _this2 = this;

      this.constructor.authorization = this.constructor.authorization || new Authorization(WSHeader.storage);

      this.constructor.authorization.onAccessTokenChange(function (accessToken) {
        if (_this2.mounted) {
          _this2.setState({ isLoggedIn: !!accessToken });
        } else {
          _this2.state.isLoggedIn = !!accessToken;
        }

        _this2.dispatchEvent('ws-auth-changed', accessToken);
      });

      this.constructor.authorization.tryFetchToken(location.hash.substr(1));

      window.addEventListener('ws-authorize', function () {
        return _this2.login();
      });

      window.addEventListener('ws-unauthorize', function () {
        return _this2.logout();
      });
    }
  }, {
    key: 'login',
    value: function login() {
      this.constructor.authorization.authorize(this.props.loginUrl, this.props.clientId, this.props.businessPartnerId);
    }
  }, {
    key: 'logout',
    value: function logout() {
      this.constructor.authorization.unauthorize();
    }
  }, {
    key: 'enterMenuItem',
    value: function enterMenuItem(index) {
      clearInterval(this.leaveTimeout);
      this.subMenus.forEach(function (subMenu) {
        return subMenu.classList.remove('is-active');
      });
      this.menuItems.forEach(function (item) {
        return item.classList.remove('is-hovered');
      });

      if (this.subMenus[index]) {
        this.level2.classList.add('is-active');
        var subMenu = this.subMenus[index];
        subMenu.classList.add('is-active');
        var item = this.menuItems[index];
        item.classList.add('is-hovered');
      } else {
        this.leaveLevel2();
      }
    }
  }, {
    key: 'leaveMenuItem',
    value: function leaveMenuItem(index) {
      var _this3 = this;

      this.leaveTimeout = setTimeout(function () {
        _this3.level2.classList.remove('is-active');
        if (_this3.subMenus[index]) {
          var subMenu = _this3.subMenus[index];
          subMenu.classList.remove('is-active');
          var item = _this3.menuItems[index];
          item.classList.remove('is-hovered');
        }
      }, 10);
    }
  }, {
    key: 'enterLevel2',
    value: function enterLevel2() {
      clearInterval(this.leaveTimeout);
    }
  }, {
    key: 'leaveLevel2',
    value: function leaveLevel2() {
      this.subMenus.forEach(function (subMenu) {
        return subMenu.classList.remove('is-active');
      });
      this.menuItems.forEach(function (item) {
        return item.classList.remove('is-hovered');
      });
      this.level2.classList.remove('is-active');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'header',
        { className: 'ws-header', ref: function ref(element) {
            _this4.element = element;
          } },
        React.createElement(
          'div',
          { className: 'level-1' },
          React.createElement(
            'a',
            {
              className: 'application-name',
              href: '#'
            },
            this.props.appLogo && React.createElement(
              'figure',
              { className: 'application-logo' },
              React.createElement('img', { src: this.props.appLogo, alt: 'Application logo' })
            ),
            this.props.appName
          ),
          React.createElement(
            'nav',
            { className: 'main-menu' },
            React.createElement(
              'ul',
              null,
              this.props.links.map(function (link, index) {
                return React.createElement(
                  'li',
                  {
                    key: 'header-link' + index,
                    onMouseEnter: function onMouseEnter() {
                      return _this4.enterMenuItem(index);
                    },
                    onMouseLeave: function onMouseLeave() {
                      return _this4.leaveMenuItem(index);
                    },
                    ref: function ref(element) {
                      _this4.menuItems[index] = element;
                    },
                    className: link.isCurrent ? 'is-current' : null
                  },
                  React.createElement(
                    'a',
                    { href: link.href, onClick: function onClick(event) {
                        if (link.onClick) link.onClick(event);
                      } },
                    link.label
                  )
                );
              })
            )
          ),
          React.createElement(
            'nav',
            { className: 'menu-controls' },
            React.createElement(
              'ul',
              null,
              React.createElement(
                'li',
                null,
                React.createElement(WSDropdown, {
                  className: 'locale',
                  icon: 'icon24 icon-sort-down',
                  items: this.locales,
                  text: this.state.locale,
                  onChange: function onChange(item) {
                    return _this4.setLocale(item.value);
                  },
                  orientation: 'right',
                  type: 'anchor'
                })
              ),
              !this.state.isLoggedIn ? React.createElement(
                'li',
                { onClick: function onClick() {
                    return _this4.login();
                  } },
                React.createElement(
                  'a',
                  null,
                  'Login'
                )
              ) : React.createElement(
                'li',
                { onClick: function onClick() {
                    return _this4.logout();
                  } },
                React.createElement(
                  'a',
                  null,
                  React.createElement('span', { className: 'icon icon24 icon-power' })
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          {
            className: 'level-2',
            onMouseEnter: function onMouseEnter() {
              return _this4.enterLevel2();
            },
            onMouseLeave: function onMouseLeave() {
              return _this4.leaveLevel2();
            },
            onClick: function onClick() {
              return _this4.leaveLevel2();
            },
            ref: function ref(element) {
              _this4.level2 = element;
            }
          },
          this.props.links.map(function (parent, index) {
            return parent.children && parent.children.length && React.createElement(
              'ul',
              { className: 'main-sub-menu', key: 'sub-menu' + index, ref: function ref(element) {
                  _this4.subMenus[index] = element;
                } },
              parent.children.map(function (child, childIndex) {
                return React.createElement(
                  'li',
                  { key: 'sub-link-' + index + '-' + childIndex, className: child.isCurrent ? 'is-current' : null },
                  React.createElement(
                    'a',
                    { href: child.href, onClick: function onClick(event) {
                        if (child.onClick) child.onClick(event);
                      } },
                    child.label
                  )
                );
              })
            );
          })
        )
      );
    }
  }]);

  return WSHeader;
}(Component);
Object.defineProperty(WSHeader, 'authorization', {
  enumerable: true,
  writable: true,
  value: undefined
});
Object.defineProperty(WSHeader, 'storage', {
  enumerable: true,
  writable: true,
  value: new LocalStorage()
});
Object.defineProperty(WSHeader, 'defaultProps', {
  enumerable: true,
  writable: true,
  value: {
    loginUrl: 'https://identity.zalando.com/oauth2/authorize',
    businessPartnerId: null,
    clientId: null,
    links: [],
    appName: 'Zalando',
    appLogo: null,
    onLocaleChange: function onLocaleChange() {},
    onAuthChange: function onAuthChange() {}
  }
});
Object.defineProperty(WSHeader, 'propTypes', {
  enumerable: true,
  writable: true,
  value: {
    loginUrl: PropTypes.string,
    businessPartnerId: PropTypes.string,
    clientId: PropTypes.string,
    links: PropTypes.array,
    appName: PropTypes.string,
    appLogo: PropTypes.string,
    onLocaleChange: PropTypes.func,
    onAuthChange: PropTypes.func
  }
});