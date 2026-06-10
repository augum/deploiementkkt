package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.SourceEnergieRequestDto;
import bdom.kikwit.Dto.SourceEnergieResponseDto;
import bdom.kikwit.Entities.SourceEnergie;
import bdom.kikwit.Mappers.SourceEnergieMapper;
import bdom.kikwit.Repositories.SourceEnergieRepository;
import bdom.kikwit.Services.SourceEnergieService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @AllArgsConstructor @Transactional
public class SourceEnergieServiceImpl implements SourceEnergieService {
    private SourceEnergieRepository repository;
    private SourceEnergieMapper mapper;
    //Enregistrement d'une source d'energie
    @Override
    public SourceEnergieResponseDto save(SourceEnergieRequestDto requestDto) {
        SourceEnergie sourceEnergie = mapper.fromSourceEnergieRequestDto(requestDto);
        SourceEnergie save = repository.save(sourceEnergie);
        return mapper.toSourceEnergieResponseDto(save);
    }
//Modification source d'energie
    @Override
    public SourceEnergieResponseDto update(Long id, SourceEnergieRequestDto requestDto) {
        SourceEnergie sourceEnergie = mapper.fromSourceEnergieRequestDto(requestDto);
        SourceEnergie energie = repository.findById(id).get();
        energie.setLibelle(sourceEnergie.getLibelle());
        return mapper.toSourceEnergieResponseDto(energie);
    }
// Liste source d'energie
    @Override
    public List<SourceEnergieResponseDto> getAll() {
        List<SourceEnergie> list = repository.findAll();

        return list.stream()
                .map(sourceEnergie -> mapper.toSourceEnergieResponseDto(sourceEnergie))
                .collect(Collectors.toList());
    }
// supprime une source d'energie
    @Override
    public String delete(Long id) {
        Optional<SourceEnergie> energie = repository.findById(id);
        if (energie.isPresent()){
           repository.deleteById(id);
            return " Source d'energie supprimé avec succes";
        }
        return "Aucune source d'energie trouvée";
    }
}
