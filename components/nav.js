import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { Flip } from 'react-reveal';
import classNames from 'classnames'
import { FiPlus, FiMinus } from 'react-icons/fi'
import './styles/app.scss'
import Drawer from './Drawer'
import CartDrawer from './CartDrawer'
import { toggleCartBar, hideCartBar, toggleRegBar } from '../redux/actions/drawers'
import { unsetUser } from '../redux/actions/user'
// import { c } from '../redux/actions/cart'
import Registration from './popups/Registration';
import Login from './popups/Login';
import { Menu, Dropdown } from 'antd';
const Nav = ({
  parent, items, isRight, isCartOpen, toggleCartBar, hideCartBar,
  toggleRegBar, isRegOpen, hasLogin, user, unsetUser
}) => {
  const [isOpen, setOpen] = useState(false)
  // const [isCartOpen, setIsCartOpen] = useState(false)
  const onClick = (e, action) => {
    if (action === "link") {

    }
    if (action === "cart") {
      toggleCartBar();
      // setIsCartOpen(!isCartOpen)
    }
    if (action === "reg") {
      toggleRegBar()
    }
    if (action === "logout") {
      unsetUser()
    }
  }
  return (
    <nav className={classNames("c-nav", {
      [`${parent}__nav`]: parent,
      [`c-nav--right`]: isRight,
    })}>
      <ul className="c-nav__list">
        {items.filter(el => {
          if (user._id) {
            return el.onlyLogin !== false
          } else {
            return el.onlyLogin !== true
          }
        }).map((el, ind) => <li key={ind} className={classNames("c-nav__list-item", {
          "c-nav__list-item--has-sub-menu": el.subMenus
        })}>
          {
            el.link ?
              <Link as={el.as || el.link} href={el.link}>
                <a onClick={(e) => {
                  onClick(e, el.action)
                }} className="c-nav__link">
                  {el.label}
                  {el.icon}
                </a>
              </Link>
              : (
                el.action === 'dropdown' ?
                  <Dropdown overlay={<Menu>
                    {
                    el.dropdownMenu.map((elx, ii) => {

                      return (<Menu.Item key={ii} >
                        <span onClick={(e) => {
                            onClick(e, elx.action)
                          }} className="c-nav__link">
                            {elx.label}
                            {elx.icon}
                          </span>
                      </Menu.Item>)
                    })
                    }
                  </Menu>} >
                    <span className="c-nav__link">
                      {el.label}
                      {el.icon}
                    </span>
                  </Dropdown> :
                  <span onClick={(e) => {
                    onClick(e, el.action)
                  }} className="c-nav__link">
                    {el.label}
                    {el.icon}
                  </span>)
          }
          {
            el.subMenus && <span onClick={() => setOpen(!isOpen)} className={classNames("c-nav__sub-menu-tgl", {
              "c-nav__sub-menu-tgl--opened": isOpen
            })}>{isOpen ? <FiMinus /> : <FiPlus />}</span>
          }
          {
            el.subMenus && <ul className="c-nav__sub-menu">
              {el.subMenus.map((elx, i) =>
                <Flip key={i} left opposite when={isOpen}>
                  <li className="c-nav__sub-menu-item">
                    <Link as={elx.as || elx.link} href={elx.link}>
                      <a className="c-nav__link c-nav__link--sub">
                        {elx.label}
                      </a>
                    </Link>
                  </li>
                </Flip>
              )}
            </ul>
          }
        </li>)}
      </ul>
      <Drawer onClose={hideCartBar} versions={["cart"]} title="Cart" visible={isCartOpen} >
        <CartDrawer />
      </Drawer>
      <Drawer onClose={toggleRegBar} title={
        hasLogin ? "Login" : "Registration"
      } visible={isRegOpen} >
        {!hasLogin && <Registration />}
        {hasLogin && <Login />}
      </Drawer>
    </nav>
  )
}

Nav.defaultProps = {
  items: []
}
const mapStateToProps = state => ({
  isCartOpen: state.drawers.isCartOpen,
  isRegOpen: state.drawers.isRegOpen,
  hasLogin: state.drawers.hasLogin,
  user: state.user
})
export default connect(mapStateToProps, { toggleCartBar, hideCartBar, toggleRegBar, unsetUser })(Nav)
