const helper = () => {
    function truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) {
            return text;
        } else {
            const truncatedText = text.substring(0, maxLength).trim();
            return `${truncatedText}...`;
        }
    }

    function getFileType(link: string) {
        const extension = link.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'doc':
            case 'docx':
                return 'doc';
            case 'pdf':
                return 'pdf';
            case 'xls':
            case 'xlsx':
                return 'xls';
            case 'ppt':
            case 'pptx':
                return 'ppt';
            default:
                return 'unknown';
        }
    };
    return {
        truncateText,
        getFileType
    }
}

export default helper;
