import React, { Component } from "react";
import styled from 'styled-components';
import PropTypes from "prop-types";

const Row = styled.div`
overflow: hidden;
padding: 0px 0px 15px 10px;
margin: 0;
box-sizing: border-box;
text-transform: uppercase;
color: ${props => props.theme.colors.transactionsDate};
font-size: ${props => `${props.theme.fontSize.regular * 1}em`};
font-weight: ${props => String(props.theme.fontWeight.bold)};
font-family: ${props => props.theme.fontFamily};
overflow: hidden;
background-color: ${props => props.theme.colors.AccordionBg};
`;


class AccordionSection extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  onClick = () => {
    this.props.onClick(this.props.label);
  };
  

  render() {
    const { onClick, props: { isOpen, label } } = this;

    return (
      <div
      >
        <Row class={label} onClick={onClick} style={{ cursor: "pointer" }}>
         {label}
        </Row>
        {isOpen && (
          <div
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;
