import React from 'react';
import { mount } from 'enzyme';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import OTPublisher from '../src/OTPublisher';

describe('OTPublisher', () => {
  let publisher;

  beforeEach(() => {
    publisher = jasmine.createSpyObj('publisher', [
      'on',
      'once',
      'off',
      'destroy',
    ]);

    spyOn(OT, 'initPublisher').and.returnValue(publisher);
  });

  describe('no props', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<OTPublisher />);
    });

    it('should not render the publisher container element', () => {
      const divContainer = wrapper.render().find('div.OTPublisherContainer');
      expect(divContainer.length).toBe(0);
    });

    it('should not call OT.initPublisher', () => {
      expect(OT.initPublisher).not.toHaveBeenCalled();
    });

    it('should not have a publisher', () => {
      expect(wrapper.instance().getPublisher()).toBe(null);
      expect(wrapper.state('publisher')).toBe(null);
    });
  });

  describe('with className prop', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<OTPublisher className="myclass" />);
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
      wrapper = mount(<OTPublisher style={style} />);
    });

    it('should render style attribute on wrapper element', () => {
      expect(wrapper.containsMatchingElement(<div style={style} />)).toEqual(true);
    });
  });

  describe('with session prop', () => {
    let session;

    beforeEach(() => {
      session = jasmine.createSpyObj('session', [
        'once',
        'off',
        'publish',
        'unpublish',
      ]);
    });

    describe('configuration', () => {
      beforeEach(() => {
        session.connection = {};
      });

      it('should not render the publisher container element when default UI is disabled', () => {
        const wrapper = mount(
          <OTPublisher session={session} properties={{ insertDefaultUI: false }} />,
        );
        const divContainer = wrapper.render().find('div.OTPublisherContainer');
        expect(divContainer.length).toBe(0);
      });
    });

    describe('connected session', () => {
      let wrapper;

      beforeEach(() => {
        session.connection = {};
        wrapper = mount(<OTPublisher session={session} />);
      });

      it('should render the publisher container element', () => {
        const divContainer = wrapper.render().find('div.OTPublisherContainer');
        expect(divContainer.length).toBe(1);
      });

      it('should call OT.initPublisher', () => {
        expect(OT.initPublisher).toHaveBeenCalledWith(
          jasmine.any(HTMLDivElement),
          jasmine.any(Object),
          jasmine.any(Function),
        );
      });

      it('should listen for streamCreated publisher event', () => {
        expect(publisher.on).toHaveBeenCalledWith(
          'streamCreated',
          jasmine.any(Function),
        );
      });

      it('should have a publisher', () => {
        expect(wrapper.instance().getPublisher()).toBe(publisher);
        expect(wrapper.state('publisher')).toBe(publisher);
      });

      it('should call session.publish', () => {
        expect(session.publish).toHaveBeenCalledWith(
          publisher,
          jasmine.any(Function),
        );
      });

      it('should not listen for sessionConnected event', () => {
        expect(session.once).not.toHaveBeenCalledWith(
          'sessionConnected',
          jasmine.any(Function),
        );
      });

      it('should have a valid publisherId', () => {
        const { publisherId } = wrapper.instance();
        expect(uuidValidate(publisherId)).toBe(true);
        expect(uuidVersion(publisherId)).toEqual(4);
      });
    });

    describe('disconnected session', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = mount(<OTPublisher session={session} />);
      });

      it('should render the publisher container element', () => {
        const divContainer = wrapper.render().find('div.OTPublisherContainer');
        expect(divContainer.length).toBe(1);
      });

      it('should call OT.initPublisher', () => {
        expect(OT.initPublisher).toHaveBeenCalledWith(
          jasmine.any(HTMLDivElement),
          jasmine.any(Object),
          jasmine.any(Function),
        );
      });

      it('should listen for streamCreated publisher event', () => {
        expect(publisher.on).toHaveBeenCalledWith(
          'streamCreated',
          jasmine.any(Function),
        );
      });

      it('should have a publisher', () => {
        expect(wrapper.instance().getPublisher()).toBe(publisher);
        expect(wrapper.state('publisher')).toBe(publisher);
      });

      it('should not call session.publish', () => {
        expect(session.publish).not.toHaveBeenCalled();
      });

      it('should listen for sessionConnected event', () => {
        expect(session.once).toHaveBeenCalledWith(
          'sessionConnected',
          jasmine.any(Function),
        );
      });

      it('should call publish once sessionConnected', () => {
        const sessionConnectedHandler = session.once.calls.first().args[1];
        sessionConnectedHandler();
        expect(session.publish).toHaveBeenCalledWith(
          publisher,
          jasmine.any(Function),
        );
      });

      it('should stop listening for sessionConnected when unmounting', () => {
        const sessionConnectedHandler = session.once.calls.first().args[1];
        wrapper.unmount();
        expect(session.off).toHaveBeenCalledWith(
          'sessionConnected',
          sessionConnectedHandler,
        );
      });

      it('should stop listening for streamCreated when unmounting', () => {
        const streamCreatedHandler = publisher.on.calls.first().args[1];
        wrapper.unmount();
        expect(publisher.off).toHaveBeenCalledWith(
          'streamCreated',
          streamCreatedHandler,
        );
      });

      it('should unpublish when unmounting', () => {
        wrapper.unmount();
        expect(session.unpublish).toHaveBeenCalledWith(publisher);
      });

      it('should destroy publisher when unmounting', () => {
        wrapper.unmount();
        expect(publisher.destroy).toHaveBeenCalled();
      });
    });
  });
});
