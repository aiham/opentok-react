import React from 'react';
import { mount } from 'enzyme';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import OTSubscriber from '../src/OTSubscriber';

describe('OTSubscriber', () => {
  describe('no props', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<OTSubscriber />);
    });

    it('should not render the subscriber container element', () => {
      const divContainer = wrapper.render().find('div.OTSubscriberContainer');
      expect(divContainer.length).toBe(0);
    });

    it('should not have a subscriber', () => {
      expect(wrapper.instance().getSubscriber()).toBe(null);
      expect(wrapper.state('subscriber')).toBe(null);
    });
  });

  describe('with className prop', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<OTSubscriber className="myclass" />);
    });

    it('should render class on wrapper element', () => {
      const divWrapper = wrapper.render().find('div.myclass');
      expect(divWrapper.length).toBe(1);
    });
  });

  describe('with style prop', () => {
    let wrapper;
    const style = { color: 'red' };

    beforeEach(() => {
      wrapper = mount(<OTSubscriber style={style} />);
    });

    it('should render style attribute on wrapper element', () => {
      expect(wrapper.containsMatchingElement(<div style={style} />)).toEqual(true);
    });
  });

  describe('with only stream prop', () => {
    let wrapper;
    let stream;

    beforeEach(() => {
      stream = {};
      wrapper = mount(<OTSubscriber stream={stream} />);
    });

    it('should not render the subscriber container element', () => {
      const divContainer = wrapper.render().find('div.OTSubscriberContainer');
      expect(divContainer.length).toBe(0);
    });

    it('should not have a subscriber', () => {
      expect(wrapper.instance().getSubscriber()).toBe(null);
      expect(wrapper.state('subscriber')).toBe(null);
    });
  });

  describe('with only session prop', () => {
    let wrapper;
    let session;

    beforeEach(() => {
      session = jasmine.createSpyObj('session', ['subscribe', 'unsubscribe']);
      wrapper = mount(<OTSubscriber session={session} />);
    });

    it('should not render the subscriber container element', () => {
      const divContainer = wrapper.render().find('div.OTSubscriberContainer');
      expect(divContainer.length).toBe(0);
    });

    it('should not subscribe', () => {
      expect(session.subscribe).not.toHaveBeenCalled();
    });

    it('should not have a subscriber', () => {
      expect(wrapper.instance().getSubscriber()).toBe(null);
      expect(wrapper.state('subscriber')).toBe(null);
    });

    it('should not unsubscribe when unmounting', () => {
      wrapper.unmount();
      expect(session.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('with both session and stream props', () => {
    let wrapper;
    let session;
    let subscriber;
    let stream;

    beforeEach(() => {
      session = jasmine.createSpyObj('session', ['subscribe', 'unsubscribe']);
      subscriber = jasmine.createSpyObj('subscriber', ['on', 'off', 'once']);
      session.subscribe.and.returnValue(subscriber);
      stream = {};
      wrapper = mount(<OTSubscriber session={session} stream={stream} />);
    });

    it('should render the subscriber container element', () => {
      const divContainer = wrapper.render().find('div.OTSubscriberContainer');
      expect(divContainer.length).toBe(1);
    });

    it('should subscribe to stream', () => {
      expect(session.subscribe).toHaveBeenCalledWith(
        stream,
        jasmine.any(Object),
        jasmine.any(Object),
        jasmine.any(Function),
      );
    });

    it('should have a subscriber', () => {
      expect(wrapper.instance().getSubscriber()).toBe(subscriber);
      expect(wrapper.state('subscriber')).toBe(subscriber);
    });

    it('should have a valid subscriberId', () => {
      const { subscriberId } = wrapper.instance();
      expect(uuidValidate(subscriberId)).toBe(true);
      expect(uuidVersion(subscriberId)).toEqual(4);
    });

    it('should unsubscribe when unmounting', () => {
      wrapper.unmount();
      expect(session.unsubscribe).toHaveBeenCalledWith(subscriber);
    });
  });
});
