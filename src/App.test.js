import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch for testing
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          title: "Test Document",
          type: "block",
          children: [
            {
              type: "h1",
              children: [
                {
                  text: "Service Agreement"
                }
              ]
            }
          ]
        }
      ])
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders loading state initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading document/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders service agreement title', async () => {
  render(<App />);
  
  await waitFor(() => {
    const titleElement = screen.getByText(/service agreement/i);
    expect(titleElement).toBeInTheDocument();
  });
});
