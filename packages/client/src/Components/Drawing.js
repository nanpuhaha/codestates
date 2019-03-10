import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../less/Drawing.less';
import axios from 'axios';
import Button from '../Module/Button';
import Circle from '../CustomOverlay/Circle';
import MyDrawingElement from './MyDrawingElement';

class Drawing extends Component {
    static propTypes = {
        map: PropTypes.object.isRequired,
        closeFn: PropTypes.func.isRequired,
        toggleModal: PropTypes.func.isRequired,
        drawingData: PropTypes.func.isRequired,
        updateDrawingData: PropTypes.func.isRequired
    };

    state = {
        index: 0,
        theNumberOfFigure: []
    }

    handleRequestSave = (parseURL, body) => {
        const { toggleModal, drawingData } = this.props;
        const basicURL = 'http://localhost:3001/';
        const isLogin = localStorage.getItem('isLogin');
        if (JSON.parse(isLogin)) {
            if (!drawingData.length) {
                return alert('그린 도형이 없습니다.\n도형을 그리고 저장버튼을 눌러주세요 :)');
            }
            axios
                .post(basicURL + parseURL, body)
                .then(result => {
                    console.log('저장성공!');
                })
                .catch(err => {
                    console.log('err: ', err);
                });
        } else {
            alert('저장을 위해선 로그인이 필요합니다 :)');
            toggleModal();
        }
    };

    updateMyDrawingElementsLists = () => {
        const { index, theNumberOfFigure } = this.state;
        this.setState({
            theNumberOfFigure: [...theNumberOfFigure, index + 1],
            index: index + 1
        });
    }

    render() {
        const {
            map,
            closeFn,
            drawingData,
            updateDrawingData
        } = this.props;
        // const { theNumberOfFigure } = this.state;
        console.log('drawingData : ', drawingData);
        return (
            <div id="drawingComponentContainer">
                <Button map={map} Shape={Circle} icons="line" updateDrawingData={updateDrawingData} />
                <Button map={map} Shape={Circle} icons="arrow" updateDrawingData={updateDrawingData} />
                <Button map={map} Shape={Circle} icons="square" updateDrawingData={updateDrawingData} />
                <Button map={map} Shape={Circle} icons="circle" updateDrawingData={updateDrawingData} />
                <Button map={map} Shape={Circle} icons="polygon" updateDrawingData={updateDrawingData} />
                <div id="myDrawingsContainer">
                    {drawingData.map((shape, index) => {
                        const newIndex = index + 1;
                        return (
                            <MyDrawingElement key={'Idrew' + newIndex} drawingData={drawingData} />
                        );
                    })}
                </div>
                <div id="saveCloseBtns">
                    <button
                        type="button"
                        className="saveCloseBtn"
                        onClick={() => {
                            this.handleRequestSave('user/save', drawingData);
                        }}
                    >
                        {`저장`}
                    </button>
                    <button
                        type="button"
                        className="saveCloseBtn"
                        onClick={() => closeFn()}
                    >
                        {`닫기`}
                    </button>
                </div>
            </div>
        );
    }
}

export default Drawing;
