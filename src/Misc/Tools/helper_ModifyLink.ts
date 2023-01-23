export const getCorrectLink = (link: string | undefined): string => {
    return link ? `https://${link.replace('https://', '').replace('http://', '')}` : '';
};
